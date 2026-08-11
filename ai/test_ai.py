import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_startup():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data

def test_training():
    response = client.post("/train")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "metrics" in data
    assert data["metrics"]["normal_samples"] == 500
    assert data["metrics"]["anomaly_samples"] == 80

def test_predictions():
    # Make sure models are trained first
    client.post("/train")

    # 1. Test normal case (voter reads page, normal speed, same device)
    normal_payload = {
        "voter_id": "voter_123",
        "election_id": "election_abc",
        "time_difference": 3600.0,
        "voting_duration": 15.0,
        "device_hash_changed": False,
        "multiple_wallets_per_ip": False,
        "unusual_login_time": False,
        "rapid_voting_attempts": False
    }
    response = client.post("/predict", json=normal_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_anomaly"] is False
    assert data["risk_score"] < 0.4

    # 2. Test anomaly case (bot voting, instant clicks, device switch)
    anomaly_payload = {
        "voter_id": "voter_456",
        "election_id": "election_abc",
        "time_difference": 5.0,
        "voting_duration": 0.2, # 0.2 seconds (bot speed)
        "device_hash_changed": True,
        "multiple_wallets_per_ip": True,
        "unusual_login_time": True,
        "rapid_voting_attempts": True
    }
    response = client.post("/predict", json=anomaly_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_anomaly"] is True
    assert data["risk_score"] > 0.6
    assert "rapid_voting" in data["reasons"]
    assert "suspicious_device" in data["reasons"]

if __name__ == "__main__":
    import sys
    pytest.main(sys.argv)
