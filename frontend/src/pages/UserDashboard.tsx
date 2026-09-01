import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import api from '../services/api';
import HolographicIdBadge from '../components/HolographicIdBadge';
import DemoSwitcherModal from '../components/DemoSwitcherModal';
import VotingSelectionModal from '../components/VotingSelectionModal';
import {
  Wallet,
  Calendar,
  Vote,
  FileCheck,
  CheckCircle2,
  User,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  School,
  Building,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  Cpu,
  Lock,
  EyeOff,
  Database,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface UserDashboardProps {
  user: any;
  onUserUpdate: (updatedUser: any) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();
  const { account, connectWallet, signChallenge } = useWeb3();

  const [elections, setElections] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'college' | 'company' | 'school' | 'general'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bindSuccess, setBindSuccess] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showVotingSelectionModal, setShowVotingSelectionModal] = useState(false);

  useEffect(() => {
    fetchDashboardData(selectedFilter);

    // Check if user just logged in and trigger post-login election selection modal automatically
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      setShowVotingSelectionModal(true);
      sessionStorage.removeItem('justLoggedIn');
    }
  }, [selectedFilter]);

  const fetchDashboardData = async (filterType: string) => {
    setIsLoading(true);
    try {
      const url = filterType === 'all' ? '/elections' : `/elections?type=${filterType}`;
      const elRes = await api.get(url);
      setElections(elRes.data.elections);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBindWallet = async () => {
    setError(null);
    setBindSuccess(null);

    try {
      const address = await connectWallet();
      if (!address) return;

      const challengeRes = await api.get(`/auth/challenge?walletAddress=${address}`);
      const { challenge } = challengeRes.data;

      const signature = await signChallenge(challenge);
      if (!signature) {
        throw new Error('Signature cancelled');
      }

      const bindRes = await api.post('/auth/bind-wallet', {
        walletAddress: address,
        challenge,
        signature
      });

      const updatedUser = bindRes.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      setBindSuccess('Wallet address bound successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to bind wallet.');
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-12 w-full max-w-full space-y-8">
      
      {/* Top Banner Artwork & Dashboard Headline */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                AI-DRIVEN, BLOCKCHAIN-SECURED VOTING SUITE
              </p>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight">
              DASHBOARD: ENROLLED VOTER [{user?.name?.toUpperCase() || 'ANONYMOUS'}]
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {user?.organizationName || 'SecureVote Global Network'} • {user?.department || 'Member'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowVotingSelectionModal(true)}
              className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 border border-cyan-400/30"
            >
              <Vote className="h-4 w-4" />
              <span>🎯 Select What & When To Vote</span>
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="bg-slate-900 border border-slate-750 hover:bg-slate-850 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Switch Presentation Persona</span>
            </button>
          </div>
        </div>

        {/* 3-Column Core Dashboard HUD (Matching Concept Artwork) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: My Active Elections */}
          <div className="md:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Vote className="h-4 w-4 text-purple-400" /> My Active Elections
                </h3>
                <span className="text-[10px] font-mono bg-purple-950 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-md">
                  {elections.length} Open
                </span>
              </div>

              {/* Elections List */}
              <div className="space-y-2.5">
                {elections.slice(0, 3).map((election) => (
                  <div
                    key={election._id}
                    onClick={() => navigate(`/elections/${election._id}`)}
                    className="p-3 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition cursor-pointer flex justify-between items-center group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Current Event</span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                        {election.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono line-clamp-1">
                        {election.organizationName || 'Institution Ballot'}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* View All Button */}
            <div className="pt-3 mt-3 border-t border-slate-850 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>LEDGER SYNC: REAL-TIME</span>
              <button
                onClick={() => setSelectedFilter('all')}
                className="text-purple-400 hover:underline font-bold"
              >
                Refresh Feeds
              </button>
            </div>
          </div>

          {/* Column 2: Voter Profile & AI Anomaly Overview */}
          <div className="md:col-span-4 space-y-4">
            {/* Voter Profile Box */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md border border-purple-400/30">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-slate-950 stroke-[3]" />
                  </span>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Voter Profile</p>
                  <h4 className="text-sm font-extrabold text-white">{user?.name || 'Registered Voter'}</h4>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{user?.organizationId || user?.email}</p>
                </div>
              </div>

              <div className="bg-emerald-950/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase">Verified</span>
              </div>
            </div>

            {/* AI Anomaly Overview Box */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 shadow-inner space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-cyan-400" /> AI ANOMALY OVERVIEW
                </h4>
                <span className="text-[9px] font-mono text-slate-400">ISOLATION FOREST</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Summary on system-wide real-time network health, bot pacing detection, and anti-proxy biometric constraints.
              </p>

              <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    SECURE LEDGER INTEGRITY: 100%
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">0.00 FRAUD</span>
              </div>
            </div>
          </div>

          {/* Column 3: Vote History & Cryptographic Telemetry */}
          <div className="md:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Database className="h-4 w-4 text-indigo-400" /> Vote History
                </h3>
                <span className="text-[10px] font-mono text-slate-400 uppercase">IMMUTABLE COUNT</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[9px] font-mono text-slate-400 uppercase">Vote Choices</p>
                  <p className="text-lg font-black text-white font-mono mt-0.5">19</p>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[9px] font-mono text-cyan-400 uppercase">Anonymized</p>
                  <p className="text-lg font-black text-cyan-300 font-mono mt-0.5">2</p>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[9px] font-mono text-purple-400 uppercase">Encrypted</p>
                  <p className="text-lg font-black text-purple-300 font-mono mt-0.5">3</p>
                </div>
              </div>

              {/* Security Annotation Checklist */}
              <div className="space-y-1.5 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  <span>Blockchain Smart Contract Verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>AI Monitoring Engine Active (DeepScan)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Immutable Audit Trail Confirmed</span>
                </div>
              </div>
            </div>

            {/* Wallet binding status */}
            <div className="pt-3 mt-3 border-t border-slate-850 flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-500">WALLET ADDRESS</span>
              {user?.isWalletBound ? (
                <span className="text-emerald-400 font-bold truncate max-w-[120px]">{user.walletAddress}</span>
              ) : (
                <button onClick={handleBindWallet} className="text-indigo-400 hover:underline font-bold">
                  Bind MetaMask
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Interactive Holographic Flow Section (Matching Concept Artwork) */}
        <div className="mt-8 pt-8 border-t border-slate-800/80">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-950/70 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-mono text-indigo-300 mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                <span>DECENTRALIZED CONSENSUS PIPELINE</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Interactive Blockchain & Smart Contract Execution Table
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing live zero-knowledge ballot lifecycle from voter biometric handshake to Sepolia testnet confirmation.
              </p>
            </div>

            {/* Concept Artwork Image Display */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 border border-emerald-500/30 px-3 py-1 rounded-full">
                VOTE CONFIRMED ON LEDGER
              </span>
            </div>
          </div>

          {/* Interactive Graphic Artwork Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
            <img 
              src="/voter_holo_dash.png" 
              alt="Holographic Voting Control Table" 
              className="w-full h-auto object-cover rounded-2xl max-h-[380px] transition duration-500 group-hover:scale-101"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 border border-slate-800 p-4 rounded-xl backdrop-blur-md flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300 font-bold">SMART CONTRACT: VotingSystem.sol // 0x7a3B27CD...</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>CONSENSUS: 100% BYZANTINE TOLERANT</span>
                <span>LATENCY: 14ms</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3D Holographic Identity Pass Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
              <span>Your Verified 3D Holographic Pass</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Move your mouse over the card to inspect cryptographic micro-engraving.</p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-2xl">
            {[
              { id: 'all', label: 'All' },
              { id: 'college', label: 'College' },
              { id: 'company', label: 'Corporate' },
              { id: 'school', label: 'School' },
              { id: 'general', label: 'Civic' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <HolographicIdBadge user={user} />
      </div>

      <DemoSwitcherModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectPersona={(updatedUser) => {
          onUserUpdate(updatedUser);
          window.location.reload();
        }}
      />

      <VotingSelectionModal
        isOpen={showVotingSelectionModal}
        onClose={() => setShowVotingSelectionModal(false)}
        elections={elections}
        onSelectSelection={(domain, timing, electionId) => {
          if (domain === 'civic') {
            setSelectedFilter('general');
          } else {
            setSelectedFilter(domain as any);
          }
        }}
      />
    </div>
  );
};

export default UserDashboard;
