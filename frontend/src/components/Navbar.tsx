import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import DemoSwitcherModal from './DemoSwitcherModal';
import Badge from './Badge';
import { ShieldCheck, LogOut, Wallet, Sparkles, GraduationCap, Briefcase, School, Building, Cpu } from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onUserUpdate?: (user: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onUserUpdate }) => {
  const { account, connectWallet, isConnecting, networkName } = useWeb3();
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleWalletConnect = async () => {
    await connectWallet();
  };

  const getDomainBadge = () => {
    if (!user) return null;
    const type = user.organizationType || 'general';
    switch (type) {
      case 'college':
        return (
          <Badge variant="info" icon={GraduationCap} className="hidden sm:inline-flex">
            College ID
          </Badge>
        );
      case 'company':
        return (
          <Badge variant="success" icon={Briefcase} className="hidden sm:inline-flex">
            Corporate Pass
          </Badge>
        );
      case 'school':
        return (
          <Badge variant="warning" icon={School} className="hidden sm:inline-flex">
            School Prefect
          </Badge>
        );
      default:
        return (
          <Badge variant="primary" icon={Building} className="hidden sm:inline-flex">
            Civic Voter
          </Badge>
        );
    }
  };

  return (
    <>
      <nav className="border-b border-slate-800 bg-slate-900/85 backdrop-blur-lg sticky top-0 z-40" dir="ltr">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-purple-400 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-teal-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-purple-400 via-indigo-300 to-teal-400 bg-clip-text text-transparent">
                  SecureVoteAI
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                  Web3 & AI Multi-Tenant Matrix
                </span>
              </div>
            </div>

            {/* Nav Items */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-slate-300 hover:text-white text-sm font-medium transition">Home</Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-slate-300 hover:text-white text-sm font-medium transition">Voting Portal</Link>
                  <Link to="/results" className="text-slate-300 hover:text-white text-sm font-medium transition">Audit Results</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition flex items-center gap-1">
                      <Cpu className="h-4 w-4" /> Admin Console
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Persona Switcher for Presentation */}
              <button
                onClick={() => setShowDemoModal(true)}
                className="flex items-center gap-1.5 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-full text-xs font-bold font-mono transition shadow-sm cursor-pointer"
                title="Switch College, Corporate, School, or Civic role"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-spin" />
                <span>Demo Switcher</span>
              </button>

              {getDomainBadge()}

              {/* MetaMask Connection Button */}
              {account ? (
                <Badge variant="primary" dot className="font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)} {networkName && `(${networkName})`}
                </Badge>
              ) : (
                <button
                  onClick={handleWalletConnect}
                  disabled={isConnecting}
                  className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono transition active:scale-95 cursor-pointer"
                >
                  <Wallet className="h-3.5 w-3.5 text-teal-400" />
                  {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </button>
              )}

              {/* Profile & Logout */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white leading-tight">
                      {user?.name ? user.name.split(' ')[0] : 'Voter'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-full transition cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md shadow-purple-500/20"
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
    </>
  );
};

export default Navbar;
