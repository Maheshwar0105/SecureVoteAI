import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useTheme } from '../context/ThemeContext';
import DemoSwitcherModal from './DemoSwitcherModal';
import MetaMaskModal from './MetaMaskModal';
import {
  ShieldCheck,
  LogOut,
  Wallet,
  Sun,
  Moon,
  Cpu,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onUserUpdate?: (user: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onUserUpdate }) => {
  const { account, connectWallet, isConnecting, networkName } = useWeb3();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);

  // Listen to the custom event dispatched by Web3Context when MetaMask is missing
  useEffect(() => {
    const handler = () => setShowMetaMaskModal(true);
    window.addEventListener('sva:metamask-missing', handler);
    return () => window.removeEventListener('sva:metamask-missing', handler);
  }, []);

  const handleWalletConnect = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setShowMetaMaskModal(true);
      return;
    }
    await connectWallet();
  };

  const navLinkStyle = {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9375rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  };

  return (
    <>
      <nav
        className="sticky top-0 z-40 border-b"
        style={{
          background: 'var(--color-nav-bg)',
          borderColor: 'var(--color-nav-border)',
          backdropFilter: 'blur(12px)',
        }}
        aria-label="Main navigation"
      >
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between h-16 items-center gap-4">

            {/* ── Logo ── */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
              aria-label="Go to home page"
            >
              <div
                className="flex items-center justify-center h-8 w-8 rounded-lg"
                style={{ background: 'var(--color-primary)' }}
              >
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className="font-bold text-base tracking-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  SecureVoteAI
                </span>
                <span
                  className="text-xs hidden sm:block"
                  style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}
                >
                  Blockchain · AI · Biometrics
                </span>
              </div>
            </button>

            {/* ── Centre nav links ── */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                ...(user ? [
                  { to: '/dashboard', label: 'Voting Portal' },
                  { to: '/results', label: 'Audit Results' },
                ] : []),
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={navLinkStyle}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  {label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  Admin Console
                </Link>
              )}
            </div>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Theme toggle */}
              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                className="flex items-center justify-center h-9 w-9 rounded-lg border transition cursor-pointer"
                style={{
                  background: 'transparent',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
              >
                {theme === 'dark'
                  ? <Sun className="h-4 w-4" />
                  : <Moon className="h-4 w-4" />
                }
              </button>

              {/* Demo switcher */}
              <button
                id="navbar-demo-switcher-btn"
                onClick={() => setShowDemoModal(true)}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition"
                style={{
                  color: 'var(--color-text-muted)',
                  borderColor: 'var(--color-border)',
                  background: 'transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--color-primary-light)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
                title="Switch demo persona"
              >
                Demo
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {/* MetaMask connection */}
              {account ? (
                <span
                  className="badge badge-success hidden sm:inline-flex"
                  title={`${account} on ${networkName}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-status-green)]" />
                  {account.slice(0, 6)}…{account.slice(-4)}
                </span>
              ) : (
                <button
                  id="navbar-connect-wallet-btn"
                  onClick={handleWalletConnect}
                  disabled={isConnecting}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition"
                  style={{
                    color: 'var(--color-text-secondary)',
                    borderColor: 'var(--color-border)',
                    background: 'transparent',
                  }}
                >
                  <Wallet className="h-3.5 w-3.5" />
                  {isConnecting ? 'Connecting…' : 'Connect Wallet'}
                </button>
              )}

              {/* User / Sign in */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                      {user?.name ? user.name.split(' ')[0] : 'Voter'}
                    </p>
                    <p className="capitalize" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                      {user.role}
                    </p>
                  </div>
                  <button
                    id="logout-btn"
                    onClick={onLogout}
                    className="flex items-center justify-center h-9 w-9 rounded-lg border transition cursor-pointer"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-muted)',
                      background: 'transparent',
                    }}
                    title="Sign out"
                    aria-label="Sign out"
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = 'var(--color-status-red)';
                      e.currentTarget.style.borderColor = 'var(--color-status-red)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  id="signin-btn"
                  onClick={() => navigate('/login')}
                  className="btn-primary py-2 px-4 text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <DemoSwitcherModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectPersona={(updatedUser) => {
          if (onUserUpdate) onUserUpdate(updatedUser);
          window.location.reload();
        }}
      />

      <MetaMaskModal
        isOpen={showMetaMaskModal}
        onClose={() => setShowMetaMaskModal(false)}
      />
    </>
  );
};

export default Navbar;
