import os
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from dotenv import load_dotenv

# Load env variables
load_dotenv()

app = FastAPI(title="SecureVote AI Anomaly Detection Service")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths for model storage
MODEL_DIR = "models"
IF_MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.joblib")
RF_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")

# Ensure models directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

class VotingTelemetry(BaseModel):
    voter_id: str
    election_id: str
    time_difference: float           # Seconds since last activity/login
    voting_duration: float            # Seconds taken from page load to click "Vote"
    device_hash_changed: bool         # Boolean indicating device fingerprint changes
    multiple_wallets_per_ip: bool     # IP address matches multiple distinct wallet addresses
    unusual_login_time: bool          # Activity occurs at irregular/unusual timing window
    rapid_voting_attempts: bool       # Flag indicating fast clicked tries

# Global model references
if_model = None
rf_model = None
scaler = None

def load_models():
    global if_model, rf_model, scaler
    try:
        if os.path.exists(IF_MODEL_PATH) and os.path.exists(RF_MODEL_PATH) and os.path.exists(SCALER_PATH):
            if_model = joblib.load(IF_MODEL_PATH)
            rf_model = joblib.load(RF_MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            print("AI Models and Scalers loaded successfully.")
            return True
    except Exception as e:
        print(f"Error loading models: {e}")
    return False

# Attempt to load models on startup
load_models()

@app.get("/")
def read_root():
    models_ready = if_model is not None and rf_model is not None
    return {
        "status": "AI Fraud Detection API is online",
        "models_loaded": models_ready
    }

@app.post("/train")
def train_models():
    global if_model, rf_model, scaler
    try:
        # Generate synthetic dataset for model training
        # Features: time_difference, voting_duration, device_hash_changed (0/1), multiple_wallets_per_ip (0/1), unusual_login_time (0/1), rapid_voting_attempts (0/1)
        np.random.seed(42)
        
        # 1. Normal patterns (low anomalies)
        normal_data = {
            "time_difference": np.random.normal(loc=3600, scale=600, size=500), # ~1 hour difference
            "voting_duration": np.random.normal(loc=12, scale=3, size=500),      # ~12 seconds to read and select candidate
            "device_hash_changed": np.zeros(500),
            "multiple_wallets_per_ip": np.zeros(500),
            "unusual_login_time": np.zeros(500),
            "rapid_voting_attempts": np.zeros(500),
            "is_anomaly": np.zeros(500)
        }
        
        # 2. Anomalous/Suspicious patterns (bot voting, credential stuffing, location hops)
        anomaly_data = {
            "time_difference": np.random.normal(loc=15, scale=5, size=80),      # repeated rapid logs/submits
            "voting_duration": np.random.normal(loc=0.5, scale=0.2, size=80),   # sub-second voting (bot clicks)
            "device_hash_changed": np.random.choice([0, 1], size=80, p=[0.2, 0.8]),
            "multiple_wallets_per_ip": np.random.choice([0, 1], size=80, p=[0.3, 0.7]),
            "unusual_login_time": np.random.choice([0, 1], size=80, p=[0.4, 0.6]),
            "rapid_voting_attempts": np.random.choice([0, 1], size=80, p=[0.1, 0.9]),
            "is_anomaly": np.ones(80)
        }

        df_normal = pd.DataFrame(normal_data)
        df_anomaly = pd.DataFrame(anomaly_data)
        df = pd.concat([df_normal, df_anomaly], ignore_index=True)

        features = [
            "time_difference",
            "voting_duration",
            "device_hash_changed",
            "multiple_wallets_per_ip",
            "unusual_login_time",
            "rapid_voting_attempts"
        ]

        X = df[features]
        y = df["is_anomaly"]

        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Fit Isolation Forest (Unsupervised)
        if_model = IsolationForest(n_estimators=100, contamination=0.15, random_state=42)
        if_model.fit(X_scaled)

        # Fit Random Forest Classifier (Supervised)
        rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
        rf_model.fit(X_scaled, y)

        # Save models
        joblib.dump(if_model, IF_MODEL_PATH)
        joblib.dump(rf_model, RF_MODEL_PATH)
        joblib.dump(scaler, SCALER_PATH)

        return {
            "status": "success",
            "message": "AI Anomaly models trained and serialized successfully.",
            "metrics": {
                "training_samples": len(df),
                "normal_samples": len(df_normal),
                "anomaly_samples": len(df_anomaly)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")

@app.post("/predict")
def predict_fraud(telemetry: VotingTelemetry):
    global if_model, rf_model, scaler
    
    if if_model is None or rf_model is None or scaler is None:
        # Auto-train if models don't exist
        train_models()

    try:
        # Prepare feature vector
        input_data = pd.DataFrame([{
            "time_difference": telemetry.time_difference,
            "voting_duration": telemetry.voting_duration,
            "device_hash_changed": 1.0 if telemetry.device_hash_changed else 0.0,
            "multiple_wallets_per_ip": 1.0 if telemetry.multiple_wallets_per_ip else 0.0,
            "unusual_login_time": 1.0 if telemetry.unusual_login_time else 0.0,
            "rapid_voting_attempts": 1.0 if telemetry.rapid_voting_attempts else 0.0
        }])

        # Scale features
        input_scaled = scaler.transform(input_data)

        # 1. Unsupervised Anomaly Detection Score (Isolation Forest)
        # decision_function returns anomaly scores (smaller value indicates higher anomaly status)
        if_score = if_model.decision_function(input_scaled)[0]
        # Normalize score between 0.0 and 1.0 (lower decision score means higher anomaly risk)
        anomaly_risk = float(np.clip(1.0 - (if_score + 0.5), 0.0, 1.0))

        # 2. Supervised Classification (Random Forest)
        rf_prob = float(rf_model.predict_proba(input_scaled)[0][1])

        # Combined Risk Score (Weighted Average)
        combined_risk = (0.4 * anomaly_risk) + (0.6 * rf_prob)
        is_anomaly = combined_risk > 0.5

        # Extract reasons
        reasons = []
        if telemetry.voting_duration < 2.0:
            reasons.append("rapid_voting")
        if telemetry.device_hash_changed:
            reasons.append("suspicious_device")
        if telemetry.multiple_wallets_per_ip:
            reasons.append("multiple_wallet_usage")
        if telemetry.time_difference < 30.0:
            reasons.append("repeated_voting_attempts")
        if telemetry.unusual_login_time:
            reasons.append("unusual_login_times")

        return {
            "voter_id": telemetry.voter_id,
            "election_id": telemetry.election_id,
            "risk_score": float(np.round(combined_risk, 4)),
            "is_anomaly": bool(is_anomaly),
            "reasons": reasons
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
