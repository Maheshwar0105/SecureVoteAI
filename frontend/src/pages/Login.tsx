import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import api from '../services/api';
import FaceVerifier from '../components/FaceVerifier';
import DemoSwitcherModal from '../components/DemoSwitcherModal';
import {
  ShieldCheck,
  Mail,
  Lock,
  Wallet,
  AlertCircle,
  Fingerprint,
  Sparkles,
  Scan,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Database,
  Globe,
  Radio
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const { connectWallet, signChallenge } = useWeb3();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const handleConventionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLoginSuccess(user);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const walletAddress = await connectWallet();
      if (!walletAddress) {
        setIsLoading(false);
        return;
      }

      const challengeRes = await api.get(`/auth/challenge?walletAddress=${walletAddress}`);
      const { challenge } = challengeRes.data;

      const signature = await signChallenge(challenge);
      if (!signature) {
        throw new Error('Message signature rejected by user');
      }

      const loginRes = await api.post('/auth/login-wallet', {
        walletAddress,
        challenge,
        signature
      });

      const { token, user } = loginRes.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLoginSuccess(user);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'MetaMask Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricFaceLogin = () => {
    setShowFaceScan(true);
  };

  const handleFaceSuccess = async () => {
    setShowFaceScan(false);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/demo-switch', { persona: 'college' });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Biometric authentication succeeded, failed to load session.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8 bg-grid relative overflow-hidden">
      {/* Background glow aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Mission Control Top Header */}
      <div className="w-full max-w-6xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 sm:p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              SECURE VOTING AI // MISSION CONTROL PORTAL
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            FINAL, VERIFIED RESULTS: <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">TOTAL INTEGRITY</span>
          </h1>
        </div>

        <button
          onClick={() => setShowDemoModal(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span>Quick Viva Persona Switcher</span>
        </button>
      </div>

      {/* Main Dual Grid: Command Center Art Showcase + Auth Interface */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Command Center Artwork with Interactive Hotspots */}
        <div className="lg:col-span-7 space-y-5">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
            <img 
              src="/secure_voting_command.png" 
              alt="Secure Voting AI Command Center" 
              className="w-full h-auto object-cover rounded-3xl transition duration-500 group-hover:scale-101"
            />
            
            {/* Holographic Top Banner Overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-slate-950/85 border border-cyan-500/40 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg text-xs font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span className="text-white font-extrabold uppercase">SECURE VOTING AI COMMAND</span>
              </div>
              <span className="text-emerald-400 font-bold">● TOTAL INTEGRITY ACTIVE</span>
            </div>

            {/* Bottom Telemetry Ticker */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-md flex flex-wrap justify-between items-center gap-2 text-[11px] font-mono text-slate-300">
              <span className="text-cyan-300 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-cyan-400" /> Global Multi-Biometric Identity Minting
              </span>
              <span className="text-purple-300">Ledger: Sepolia Ethereum Testnet</span>
            </div>
          </div>

          {/* Interactive Pillars Grid from Command Center */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition cursor-pointer">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Fingerprint className="h-4 w-4" />
                <h4 className="text-xs font-bold">Biometric Minting</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">128-d face descriptors with anti-spoof liveness verify voter identity.</p>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition cursor-pointer">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <ShieldAlert className="h-4 w-4" />
                <h4 className="text-xs font-bold">AI Threat Shield</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Isolation Forest evaluates timing intervals & bot script cadence in real-time.</p>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition cursor-pointer">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Database className="h-4 w-4" />
                <h4 className="text-xs font-bold">Ledger Finality</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Zero-trust immutable ballots recorded to smart contracts without admins.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-purple-950/70 border border-purple-500/30 px-3 py-1 rounded-full text-[10px] font-mono text-purple-300">
              <Radio className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              <span>VOTER AUTHENTICATION GATEWAY</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Voter Sign In</h2>
            <p className="text-slate-400 text-xs">
              Access your college, corporate, school, or civic voting ballot.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 p-3.5 rounded-xl text-red-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Facial Scan Authentication Button */}
          <button
            type="button"
            onClick={handleBiometricFaceLogin}
            className="w-full p-3.5 bg-gradient-to-r from-cyan-950/80 to-emerald-950/80 border border-cyan-500/40 hover:border-cyan-400 rounded-2xl transition flex items-center justify-between gap-3 shadow-inner group cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition">
                <Scan className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white group-hover:text-cyan-300 transition">
                  Authenticate Via Facial Scan
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">Live biometric webcam match</p>
              </div>
            </div>
            <span className="bg-cyan-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-lg">
              SCAN NOW
            </span>
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest"><span className="bg-slate-900 px-3 text-slate-500">Or Email & Password</span></div>
          </div>

          <form onSubmit={handleConventionalLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Official Email / ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voter@college.edu or emp@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition text-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-purple-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Gateway'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Web3 MetaMask Signature Login */}
          <button
            onClick={handleWalletLogin}
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 py-3 rounded-xl flex items-center justify-center gap-2.5 transition text-xs font-bold cursor-pointer active:scale-[0.98]"
          >
            <Wallet className="h-4.5 w-4.5 text-indigo-400" />
            <span>Login with MetaMask Signature</span>
          </button>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
            <span>New voter without ID?</span>
            <button
              onClick={() => navigate('/register')}
              className="text-purple-400 hover:text-purple-300 font-bold transition cursor-pointer underline"
            >
              Register New Account
            </button>
          </div>
        </div>

      </div>

      {showFaceScan && (
        <FaceVerifier
          onVerificationSuccess={handleFaceSuccess}
          onClose={() => setShowFaceScan(false)}
          actionText="Verify Identity"
        />
      )}

      <DemoSwitcherModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectPersona={(updatedUser) => {
          onLoginSuccess(updatedUser);
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default Login;
