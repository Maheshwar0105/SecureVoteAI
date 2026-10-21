import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import api from '../services/api';
import FaceVerifier from '../components/FaceVerifier';
import DemoSwitcherModal from '../components/DemoSwitcherModal';
import MetaMaskModal from '../components/MetaMaskModal';
import { useToast } from '../context/ToastContext';
import {
  ShieldCheck,
  Mail,
  Lock,
  Wallet,
  AlertCircle,
  Scan,
  ArrowRight,
  CheckCircle2,
  Lock as LockIcon,
  Globe,
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    heading: 'Multi-layer identity verification',
    body: 'Every voter is authenticated via email credentials, facial biometrics, or a cryptographic MetaMask signature before any ballot is accepted.',
  },
  {
    icon: LockIcon,
    heading: 'Immutable blockchain audit trail',
    body: 'Each vote is recorded as an on-chain transaction on the Ethereum network — tamper-proof, verifiable, and permanently auditable.',
  },
  {
    icon: Globe,
    heading: 'AI-powered fraud prevention',
    body: 'An Isolation Forest model monitors voting patterns in real time, flagging bot scripts, Sybil attempts, and biometric spoofing.',
  },
];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const { connectWallet, signChallenge } = useWeb3();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);

  const redirectUser = (user: any) => {
    onLoginSuccess(user);
    if (user.role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  const handleConventionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('justLoggedIn', 'true');
      addToast(`Welcome back, ${user.name?.split(' ')[0] || 'Voter'}!`, 'success');
      redirectUser(user);
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Unable to reach the server. Check your network or use the Demo Switcher to explore the app.');
      } else {
        setError(err.response?.data?.error || 'Sign in failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setShowMetaMaskModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const walletAddress = await connectWallet();
      if (!walletAddress) { setIsLoading(false); return; }

      const challengeRes = await api.get(`/auth/challenge?walletAddress=${walletAddress}`);
      const { challenge } = challengeRes.data;

      const signature = await signChallenge(challenge);
      if (!signature) throw new Error('Wallet signature was cancelled.');

      const loginRes = await api.post('/auth/login-wallet', { walletAddress, challenge, signature });
      const { token, user } = loginRes.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('justLoggedIn', 'true');
      addToast('Wallet authenticated successfully.', 'success');
      redirectUser(user);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'MetaMask login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricFaceLogin = () => {
    if (!email) {
      setError('Please enter your email address first so we can match your biometric signature.');
      return;
    }
    setError(null);
    setShowFaceScan(true);
  };

  const handleFaceSuccess = async (faceEmbedding: number[]) => {
    setShowFaceScan(false);
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login-face', { email, faceEmbedding });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      sessionStorage.setItem('justLoggedIn', 'true');
      addToast('Biometric verification successful.', 'success');
      redirectUser(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Biometric authentication failed. Signature mismatch.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex-1 flex items-stretch min-h-[calc(100vh-4rem)]"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* ── LEFT PANEL ─────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-center px-12 xl:px-16 py-12 w-[44%] shrink-0 relative overflow-hidden"
        style={{ background: 'var(--color-primary)', color: '#ffffff' }}
      >
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,1) 40px),' +
              'repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,1) 40px)',
          }}
        />

        <div className="relative z-10 max-w-sm">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/15">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">SecureVoteAI</span>
          </div>

          {/* Product statement */}
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight text-white mb-4">
            Trusted digital elections for every institution
          </h1>
          <p className="text-base text-white/80 leading-relaxed mb-10">
            SecureVoteAI combines blockchain immutability, AI fraud detection, and biometric identity to run verifiably fair elections — for colleges, companies, schools, and civic bodies.
          </p>

          {/* Trust points */}
          <div className="space-y-6">
            {TRUST_POINTS.map(({ icon: Icon, heading, body }) => (
              <div key={heading} className="flex items-start gap-4">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/15 shrink-0 mt-0.5">
                  <Icon className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{heading}</p>
                  <p className="text-sm text-white/70 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Sign-in form ──────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-10"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="w-full max-w-[420px]">

          {/* Mobile logo (visible < lg) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <ShieldCheck className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
            <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>SecureVoteAI</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Sign in to your account
          </h2>
          <p className="text-sm mb-7" style={{ color: 'var(--color-text-muted)' }}>
            Access your college, corporate, school, or civic voting portal.
          </p>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 p-3.5 rounded-lg mb-5 text-sm"
              style={{
                background: 'var(--color-status-red-bg)',
                border: '1px solid rgba(220,38,38,0.3)',
                color: 'var(--color-status-red)',
              }}
            >
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Email / Password form ── */}
          <form onSubmit={handleConventionalLogin} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="block mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 pointer-events-none"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voter@institution.edu"
                  className="sva-input sva-input-icon"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 pointer-events-none"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="sva-input sva-input-icon"
                />
              </div>
            </div>

            {/* Primary action button — ONE per screen */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="sva-divider my-5">
            <span>or continue with</span>
          </div>

          {/* Secondary auth options */}
          <div className="space-y-3">
            {/* Biometric face scan */}
            <button
              id="login-face-btn"
              type="button"
              onClick={handleBiometricFaceLogin}
              disabled={isLoading}
              className="btn-secondary w-full"
            >
              <Scan className="h-4.5 w-4.5" style={{ color: 'var(--color-primary)' }} />
              <span>Biometric Facial Scan</span>
            </button>

            {/* MetaMask wallet */}
            <button
              id="login-wallet-btn"
              type="button"
              onClick={handleWalletLogin}
              disabled={isLoading}
              className="btn-secondary w-full"
            >
              <Wallet className="h-4.5 w-4.5" style={{ color: 'var(--color-primary)' }} />
              <span>MetaMask Wallet Signature</span>
            </button>
          </div>

          {/* Footer links */}
          <div className="mt-7 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm" style={{ borderTop: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>New to SecureVoteAI?</span>
            <button
              id="goto-register-btn"
              onClick={() => navigate('/register')}
              className="font-semibold cursor-pointer transition"
              style={{ color: 'var(--color-primary)' }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
            >
              Create an account →
            </button>
          </div>

          {/* Demo switcher — subtle, not a badge */}
          <div className="mt-4 text-center">
            <button
              id="demo-switcher-btn"
              onClick={() => setShowDemoModal(true)}
              className="text-xs cursor-pointer transition"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              Demo mode: switch persona
            </button>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {showFaceScan && (
        <FaceVerifier
          email={email}
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

      <MetaMaskModal
        isOpen={showMetaMaskModal}
        onClose={() => setShowMetaMaskModal(false)}
      />
    </div>
  );
};

export default Login;
