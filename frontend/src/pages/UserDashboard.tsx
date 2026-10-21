import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import api from '../services/api';
import HolographicIdBadge from '../components/HolographicIdBadge';
import DemoSwitcherModal from '../components/DemoSwitcherModal';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { DashboardSkeleton, EmptyState, SkeletonCard } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import {
  Vote,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Database,
  ChevronRight,
  AlertCircle,
  CalendarX,
  Clock,
  BarChart2,
  Lock,
} from 'lucide-react';

interface UserDashboardProps {
  user: any;
  onUserUpdate: (updatedUser: any) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function computeStatus(el: any): 'upcoming' | 'active' | 'completed' {
  return el.computedStatus || el.status || 'active';
}

function Countdown({ endTime }: { endTime: string }) {
  const [diff, setDiff] = useState(Math.max(0, new Date(endTime).getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, new Date(endTime).getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, [endTime]);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (diff === 0) return <span style={{ color: 'var(--color-status-red)' }}>Closed</span>;
  return <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-status-amber)' }}>{h}h {m}m {s}s</span>;
}

function ElectionStatusBadge({ status }: { status: string }) {
  if (status === 'active') return <Badge variant="success" dot>Live</Badge>;
  if (status === 'upcoming') return <Badge variant="warning" dot>Upcoming</Badge>;
  return <Badge variant="neutral">Closed</Badge>;
}

// ── Main component ────────────────────────────────────────────────────────────
export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();
  const { connectWallet, signChallenge } = useWeb3();
  const { addToast } = useToast();

  const [elections, setElections] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'college' | 'company' | 'school' | 'general'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [voteStatuses, setVoteStatuses] = useState<Record<string, boolean>>({});

  const fetchDashboardData = useCallback(async (filterType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = filterType === 'all' ? '/elections' : `/elections?type=${filterType}`;
      const elRes = await api.get(url);
      setElections(elRes.data.elections);

      // Check voted status for each active election
      const token = localStorage.getItem('token');
      if (token) {
        const statusMap: Record<string, boolean> = {};
        await Promise.allSettled(
          elRes.data.elections
            .filter((el: any) => computeStatus(el) === 'active')
            .map(async (el: any) => {
              try {
                const res = await api.get(`/voting/check/${el._id}`);
                statusMap[el._id] = res.data.hasVoted;
              } catch {
                statusMap[el._id] = false;
              }
            })
        );
        setVoteStatuses(statusMap);
      }
    } catch (err: any) {
      const msg = 'Unable to load elections. Check your network connection.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDashboardData(selectedFilter);
  }, [selectedFilter, fetchDashboardData]);

  const handleBindWallet = async () => {
    setError(null);
    try {
      const address = await connectWallet();
      if (!address) return;
      const challengeRes = await api.get(`/auth/challenge?walletAddress=${address}`);
      const { challenge } = challengeRes.data;
      const signature = await signChallenge(challenge);
      if (!signature) throw new Error('Signature cancelled');
      const bindRes = await api.post('/auth/bind-wallet', { walletAddress: address, challenge, signature });
      const updatedUser = bindRes.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      addToast('Wallet address bound successfully!', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to bind wallet.';
      setError(msg);
      addToast(msg, 'error');
    }
  };

  const goToElection = (el: any) => {
    const slug = el.slug || el._id;
    navigate(`/elections/${slug}`);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const activeCount = elections.filter((e) => computeStatus(e) === 'active').length;
  const upcomingCount = elections.filter((e) => computeStatus(e) === 'upcoming').length;
  const votedCount = Object.values(voteStatuses).filter(Boolean).length;

  return (
    <div
      className="flex-1 py-8 px-4 sm:px-6 lg:px-12 w-full max-w-full space-y-8"
      style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="rounded-xl p-6 border"
        style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Badge variant="success" dot size="sm" className="mb-2">Voter Portal Active</Badge>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Voter'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {user?.organizationName || 'SecureVote Network'} · {user?.department || 'Member'}
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Vote, label: 'Live Elections', value: activeCount, color: 'var(--color-status-green)' },
              { icon: Clock, label: 'Upcoming', value: upcomingCount, color: 'var(--color-status-amber)' },
              { icon: CheckCircle2, label: 'Voted In', value: votedCount, color: 'var(--color-primary)' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
                style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                <span style={{ color: 'var(--color-text-muted)' }}>{label}:</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl text-sm"
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

      {/* ── Election List ───────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Elections You're Eligible For
          </h2>

          {/* Filter tabs */}
          <div
            className="flex flex-wrap gap-1 p-1 rounded-lg border"
            style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
          >
            {([
              { id: 'all', label: 'All' },
              { id: 'college', label: 'College' },
              { id: 'company', label: 'Corporate' },
              { id: 'school', label: 'School' },
              { id: 'general', label: 'Civic' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                id={`filter-${tab.id}`}
                onClick={() => setSelectedFilter(tab.id)}
                className="px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer"
                style={{
                  background: selectedFilter === tab.id ? 'var(--color-primary)' : 'transparent',
                  color: selectedFilter === tab.id ? '#ffffff' : 'var(--color-text-muted)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : elections.length === 0 ? (
          <EmptyState
            icon={<CalendarX className="h-7 w-7" />}
            title="No elections available"
            description="There are no elections matching your filter right now. Check back later or contact your administrator."
            action={
              <button onClick={() => setSelectedFilter('all')} className="btn-secondary">
                Show all elections
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {elections.map((el) => {
              const status = computeStatus(el);
              const hasVoted = voteStatuses[el._id];
              const slug = el.slug || el._id;

              return (
                <div
                  key={el._id}
                  id={`election-card-${el._id}`}
                  className="rounded-xl border flex flex-col transition"
                  style={{
                    background: 'var(--color-card-bg)',
                    borderColor: 'var(--color-card-border)',
                    boxShadow: 'var(--color-card-shadow)',
                  }}
                >
                  {/* Card header */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <ElectionStatusBadge status={status} />
                      {hasVoted && (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />Vote Recorded
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-base font-semibold leading-snug mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
                      {el.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
                      {el.organizationName || 'Institution'}
                    </p>

                    {/* Positions */}
                    {el.contestedPositions?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {el.contestedPositions.slice(0, 3).map((pos: string) => (
                          <span
                            key={pos}
                            className="text-xs px-2 py-0.5 rounded-md border"
                            style={{
                              background: 'var(--color-surface-alt)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            {pos}
                          </span>
                        ))}
                        {el.contestedPositions.length > 3 && (
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            +{el.contestedPositions.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Countdown for live elections */}
                    {status === 'active' && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5" style={{ color: 'var(--color-status-amber)' }} />
                        <Countdown endTime={el.endTime} />
                      </div>
                    )}
                    {status === 'upcoming' && (
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Opens {new Date(el.startTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    {status === 'completed' && (
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        Ended {new Date(el.endTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>

                  {/* Card footer — single action per card */}
                  <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ borderTop: '1px solid var(--color-border)' }}
                  >
                    {hasVoted ? (
                      <button
                        onClick={() => goToElection(el)}
                        className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition"
                        style={{ color: 'var(--color-status-green)' }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        View Receipt
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : status === 'active' ? (
                      <button
                        id={`vote-btn-${el._id}`}
                        onClick={() => goToElection(el)}
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        <Vote className="h-3.5 w-3.5" />
                        Vote Now
                      </button>
                    ) : status === 'upcoming' ? (
                      <button
                        disabled
                        className="flex items-center gap-1.5 text-sm font-medium cursor-not-allowed opacity-60"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Lock className="h-4 w-4" /> Not Yet Open
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/results')}
                        className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer transition"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        <BarChart2 className="h-4 w-4" />
                        View Results
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Profile + Security + Wallet Row ────────────────────────────────── */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Voter profile */}
          <div
            className="rounded-xl border p-5 flex items-center gap-4"
            style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
          >
            <div className="relative shrink-0">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'var(--color-primary)' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'V'}
              </div>
              <span
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 flex items-center justify-center"
                style={{ background: 'var(--color-status-green)', borderColor: 'var(--color-bg)' }}
              >
                <CheckCircle2 className="h-3 w-3 text-white stroke-[3]" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Voter Profile</p>
              <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                {user?.name || 'Registered Voter'}
              </h4>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                {user?.email}
              </p>
            </div>
            <Badge variant="success" size="sm" className="shrink-0">Verified</Badge>
          </div>

          {/* AI Security */}
          <div
            className="rounded-xl border p-5 space-y-3"
            style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
          >
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--color-text-primary)' }}>
                <Cpu className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                AI Security
              </h4>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Isolation Forest</span>
            </div>
            <div
              className="flex items-center justify-between p-2.5 rounded-lg"
              style={{ background: 'var(--color-status-green-bg)', border: '1px solid rgba(22,163,74,0.25)' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--color-status-green)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--color-status-green)' }}>
                  Ledger Integrity: 100%
                </span>
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-status-green)' }}>0 Fraud</span>
            </div>
          </div>

          {/* Wallet / Vote stats */}
          <div
            className="rounded-xl border p-5"
            style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
          >
            <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-3" style={{ color: 'var(--color-text-primary)' }}>
              <Database className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
              Vote Record
            </h4>
            <div className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {[
                { dot: 'var(--color-primary)', text: 'Smart Contract Verified' },
                { dot: 'var(--color-status-green)', text: 'AI Monitoring Active' },
                { dot: 'var(--color-primary)', text: 'Immutable Audit Trail' },
              ].map(({ dot, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: dot }} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-3 pt-3 flex justify-between items-center text-sm"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <span style={{ color: 'var(--color-text-muted)' }}>Wallet</span>
              {user?.isWalletBound ? (
                <span className="font-semibold text-xs truncate max-w-[130px]" style={{ color: 'var(--color-status-green)' }}>
                  {user.walletAddress}
                </span>
              ) : (
                <button
                  id="bind-wallet-btn"
                  onClick={handleBindWallet}
                  className="font-semibold cursor-pointer transition text-sm"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Bind MetaMask
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Holographic ID Pass ─────────────────────────────────────────────── */}
      {!isLoading && (
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <ShieldCheck className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                Your Verified Digital ID Pass
              </h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                Hover over the card to inspect cryptographic details.
              </p>
            </div>
            <Badge variant="primary" size="sm">{user?.organizationType || 'voter'}</Badge>
          </div>
          <HolographicIdBadge user={user} />
        </Card>
      )}

      <DemoSwitcherModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectPersona={(updatedUser) => {
          onUserUpdate(updatedUser);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default UserDashboard;
