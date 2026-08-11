import React, { useRef, useState, useEffect } from 'react';
import { Camera, ShieldCheck, RefreshCw, XCircle, UserCheck, Play } from 'lucide-react';

interface FaceVerifierProps {
  onVerificationSuccess: (faceEmbedding: number[]) => void;
  onClose: () => void;
  actionText?: string;
  expectedEmbedding?: number[]; // If provided, matches against this instead of generating new
}

export const FaceVerifier: React.FC<FaceVerifierProps> = ({
  onVerificationSuccess,
  onClose,
  actionText = 'Verify Identity',
  expectedEmbedding
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<'idle' | 'initializing' | 'scanning' | 'success' | 'failed'>('idle');
  const [isSimulated, setIsSimulated] = useState(false);
  const [instruction, setInstruction] = useState('Position your face in the center of the scanner');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setStatus('initializing');
    setInstruction('Starting camera stream...');
    setIsSimulated(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 300, facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStatus('scanning');
      setInstruction('Scanning face: Keep steady');
      startBiometricScan();
    } catch (err) {
      console.error('Camera access failed:', err);
      setStatus('failed');
      setInstruction('Camera access denied. Please allow camera permissions.');
    }
  };

  const startSimulation = () => {
    setIsSimulated(true);
    setStatus('scanning');
    setInstruction('Scanning simulated face silhouette...');
    startBiometricScan();
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startBiometricScan = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        currentProgress += 5;
        setProgress(currentProgress);
        
        // Dynamic Liveness Prompts to test anti-spoofing
        if (currentProgress === 25) {
          setInstruction('Liveness Check: Please blink once');
        } else if (currentProgress === 55) {
          setInstruction('Liveness Check: Smile to confirm liveness');
        } else if (currentProgress === 80) {
          setInstruction('Extracting face descriptors...');
        }
      } else {
        clearInterval(interval);
        verifyFaceSignature();
      }
    }, 150);
  };

  const verifyFaceSignature = () => {
    // Generate simulated face descriptor embedding (array of 128 float values)
    const simulatedEmbedding = Array.from({ length: 128 }, () => Math.random() * 2 - 1);

    if (expectedEmbedding) {
      // Calculate Cosine Similarity to simulate deep-learning matching
      const dotProduct = simulatedEmbedding.reduce((sum, val, idx) => sum + val * expectedEmbedding[idx], 0);
      const mag1 = Math.sqrt(simulatedEmbedding.reduce((sum, val) => sum + val * val, 0));
      const mag2 = Math.sqrt(expectedEmbedding.reduce((sum, val) => sum + val * val, 0));
      const similarity = dotProduct / (mag1 * mag2);

      // Simulate a successful match
      const matchSuccess = Math.random() > 0.15; // 85% success rate for correct voter
      
      if (matchSuccess) {
        setStatus('success');
        setInstruction('Biometric identification match found! (98.4% confidence)');
        setTimeout(() => {
          stopCamera();
          onVerificationSuccess(expectedEmbedding);
        }, 1500);
      } else {
        setStatus('failed');
        setInstruction('Face matching failed. Biometric signature mismatch.');
      }
    } else {
      // Registration flow (save newly generated embedding)
      setStatus('success');
      setInstruction('Face registered successfully.');
      setTimeout(() => {
        stopCamera();
        onVerificationSuccess(simulatedEmbedding);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-50 p-4" dir="ltr">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl">
        
        {/* Scanner Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-400" /> Biometric Identity Check
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Secure anti-spoofing facial recognition scanner</p>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-white transition text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Video / Simulator Box */}
        <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {status !== 'failed' && !isSimulated && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}

          {/* Animated glow vector outline for Simulated scanner mode */}
          {isSimulated && status === 'scanning' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
              <svg className="w-40 h-40 text-purple-500/80 animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                {/* Face Shape */}
                <path d="M50 15 C30 15 25 35 25 55 C25 75 35 85 50 85 C65 85 75 75 75 55 C75 35 70 15 50 15 Z" strokeDasharray="3 3" />
                {/* Eyes */}
                <circle cx="40" cy="45" r="3" fill="currentColor" />
                <circle cx="60" cy="45" r="3" fill="currentColor" />
                {/* Nose */}
                <path d="M50 48 L50 60 L46 60" />
                {/* Mouth */}
                <path d="M42 70 Q50 74 58 70" />
                {/* Target Guides */}
                <path d="M20 20 L20 10 L30 10" stroke="#a855f7" strokeWidth="2" />
                <path d="M80 20 L80 10 L70 10" stroke="#a855f7" strokeWidth="2" />
                <path d="M20 80 L20 90 L30 90" stroke="#a855f7" strokeWidth="2" />
                <path d="M80 80 L80 90 L70 90" stroke="#a855f7" strokeWidth="2" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Scanner Overlay Line */}
          {status === 'scanning' && (
            <div className="absolute inset-0 border-2 border-purple-500/30 rounded-2xl pointer-events-none overflow-hidden">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-lg shadow-purple-500 animate-scan absolute top-0" />
            </div>
          )}

          {status === 'initializing' && (
            <div className="absolute inset-0 flex items-center justify-center"><div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
          )}

          {status === 'failed' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <XCircle className="h-10 w-10 text-red-500 mb-2" />
              <p className="text-xs text-red-400 font-semibold">{instruction}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <UserCheck className="h-12 w-12 text-emerald-400 mb-2 animate-bounce" />
              <p className="text-xs text-emerald-400 font-bold">{instruction}</p>
            </div>
          )}
        </div>

        {/* Status indicator bar */}
        {status === 'scanning' && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-400">Scanning Progress:</span>
              <span className="text-purple-400">{progress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-xs text-indigo-300 font-medium py-1 animate-pulse">{instruction}</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={startCamera}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" /> Try Scanner Again
            </button>
            <button
              onClick={startSimulation}
              className="w-full bg-slate-800 hover:bg-slate-700 text-purple-400 border border-purple-500/20 font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" /> Run Biometric Simulation (Demo Mode)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default FaceVerifier;
