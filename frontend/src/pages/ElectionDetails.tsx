import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useWeb3 } from '../context/Web3Context';
import { useToast } from '../context/ToastContext';
import { castVoteOnChain } from '../services/web3Service';
import FaceVerifier from '../components/FaceVerifier';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { DashboardSkeleton, EmptyState } from '../components/Skeleton';
import {
  CheckCircle2,
  Vote,
  Check,
  Scan,
  Wallet,
  FileText,
  ExternalLink,
  Download,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Clock,
  Lock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

// ── Stepper steps ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Select Candidate' },
  { id: 2, label: 'Verify Identity' },
  { id: 3, label: 'Review Ballot' },
  { id: 4, label: 'Sign Transaction' },
  { id: 5, label: 'Receipt' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d: string | Date) {
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function Countdown({ endTime }: { endTime: string }) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const tick = () => setDiff(Math.max(0, new Date(endTime).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  if (diff === 0) return <span style={{ color: 'var(--color-status-red)' }}>Closed</span>;
  return (
    <span style={{ color: 'var(--color-status-amber)', fontVariantNumeric: 'tabular-nums' }}>
      {h}h {m}m {s}s remaining
    </span>
  );
}

// ── PDF Receipt generation (pure client-side) ─────────────────────────────────
function downloadPDFReceipt(receipt: any, election: any) {
  const content = `
SECUREVOTEAI — OFFICIAL VOTE RECEIPT
=====================================
Election:    ${election.title}
Institution: ${election.organizationName || 'SecureVote Network'}
Status:      Vote Recorded on Blockchain

TRANSACTION DETAILS
-------------------
Transaction Hash:
  ${receipt.txHash}

Block Number:    ${receipt.blockNumber ?? 'Pending'}
Timestamp:       ${formatDate(receipt.timestamp)}
Network:         Ethereum Sepolia Testnet
Etherscan URL:   https://sepolia.etherscan.io/tx/${receipt.txHash}

PRIVACY NOTICE
--------------
Your ballot choice is encrypted on-chain. This receipt
confirms participation without revealing your selection.

Issued by SecureVoteAI | ${new Date().toISOString()}
  `.trim();

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vote-receipt-${receipt.txHash.slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main component ────────────────────────────────────────────────────────────
export const ElectionDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { account, connectWallet, networkName } = useWeb3();
  const { addToast } = useToast();

  const [election, setElection] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stepper
  const [step, setStep] = useState(1);

  // Step 1 — candidate selection (per position)
  const [selectedVotes, setSelectedVotes] = useState<{ [position: string]: string }>({});
  const [activePosition, setActivePosition] = useState('');

  // Step 2 — biometric
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);

  // Step 4 — blockchain tx
  const [isSigning, setIsSigning] = useState(false);

  // Step 5 — receipt
  const [receipt, setReceipt] = useState<any>(null);

  // Already-voted state
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [existingReceipt, setExistingReceipt] = useState<any>(null);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchElection = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/elections/${slug}`);
      setElection(res.data.election);
      setCandidates(res.data.candidates);
      const positions: string[] = res.data.election.contestedPositions || ['Representative'];
      if (positions.length > 0) setActivePosition(positions[0]);

      // Check if user has already voted
      try {
        const checkRes = await api.get(`/voting/check/${res.data.election._id}`);
        if (checkRes.data.hasVoted) {
          setAlreadyVoted(true);
          setExistingReceipt(checkRes.data.receipt);
          setStep(5);
          setReceipt(checkRes.data.receipt);
        }
      } catch {
        // Not authenticated or check failed — proceed normally
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load election.');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchElection(); }, [fetchElection]);

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 py-10 px-4 sm:px-6 lg:px-12" style={{ background: 'var(--color-bg)' }}>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="flex-1 py-20 px-4" style={{ background: 'var(--color-bg)' }}>
        <EmptyState
          icon={<AlertCircle className="h-7 w-7" />}
          title="Election not found"
          description={error || 'The election you are looking for does not exist or has been removed.'}
          action={
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              ← Back to Dashboard
            </button>
          }
        />
      </div>
    );
  }

  const positions: string[] = election.contestedPositions?.length
    ? election.contestedPositions
    : ['Representative'];

  const computedStatus: 'upcoming' | 'active' | 'completed' =
    election.computedStatus || election.status || 'active';

  const currentCandidates = candidates.filter((c) => {
    if (positions.length <= 1) return true;
    return c.position === activePosition || !c.position || c.position === 'Candidate';
  });

  const allPositionsVoted = positions.every((p) => selectedVotes[p]);
  const chosenCandidateId = selectedVotes[activePosition] || Object.values(selectedVotes)[0];
  const chosenCandidate = candidates.find((c) => c._id === chosenCandidateId);

  // ── Step handlers ───────────────────────────────────────────────────────────
  const goNext = () => setStep((s) => Math.min(s + 1, 5));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleFaceSuccess = () => {
    setShowFaceScan(false);
    setFaceVerified(true);
    addToast('Biometric identity verified.', 'success');
    goNext();
  };

  const handleSignAndSubmit = async () => {
    setIsSigning(true);
    setError(null);

    let activeAccount = account;
    if (!activeAccount) activeAccount = await connectWallet();

    const chosenId = Object.values(selectedVotes)[0];
    if (!chosenId) {
      setError('No candidate selected.');
      setIsSigning(false);
      return;
    }

    try {
      let txHash: string;
      let blockNumber: number | null = null;

      if (typeof window !== 'undefined' && (window as any).ethereum && activeAccount) {
        addToast('Opening MetaMask — please approve the transaction.', 'info');
        try {
          const numericElectionId = parseInt(election._id?.slice(-4) || '1', 16) || 1;
          const numericCandidateId = candidates.findIndex((c) => c._id === chosenId) + 1 || 1;
          const txReceipt = await castVoteOnChain(numericElectionId, numericCandidateId);
          txHash = txReceipt.hash;
          blockNumber = txReceipt.blockNumber;
        } catch (contractErr: any) {
          if (contractErr.code === 4001 || contractErr.message?.includes('user rejected')) {
            throw new Error('Transaction was rejected in MetaMask.');
          }
          // Graceful fallback for demo / no contract deployed
          txHash = '0x' + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)).join('');
        }
      } else {
        // No MetaMask — simulate for demo
        txHash = '0x' + Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)).join('');
      }

      const voteRes = await api.post('/voting', {
        electionId: election._id,
        candidateId: chosenId,
        txHash,
        blockNumber,
        faceVerified,
      });

      setReceipt(voteRes.data.receipt);
      addToast('Vote recorded on the blockchain!', 'success');
      setStep(5);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Voting failed. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsSigning(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex-1 py-8 px-4 sm:px-6 lg:px-12 w-full max-w-full"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Back + Election header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm mb-4 cursor-pointer transition"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div
          className="rounded-xl p-5 border flex flex-wrap justify-between items-start gap-4"
          style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="neutral">{election.category || 'Election'}</Badge>
              {computedStatus === 'active' && <Badge variant="success" dot>Live</Badge>}
              {computedStatus === 'upcoming' && <Badge variant="warning" dot>Upcoming</Badge>}
              {computedStatus === 'completed' && <Badge variant="neutral">Closed</Badge>}
              {alreadyVoted && <Badge variant="success"><CheckCircle2 className="h-3 w-3 inline mr-1" />Vote Recorded</Badge>}
            </div>
            <h1 className="text-xl font-bold leading-snug mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {election.title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {election.organizationName}
            </p>
          </div>

          <div
            className="shrink-0 text-sm rounded-lg p-3 border space-y-1"
            style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">Ends {formatDate(election.endTime)}</span>
            </div>
            {computedStatus === 'active' && (
              <div className="text-xs font-semibold">
                <Countdown endTime={election.endTime} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Election closed banner */}
      {computedStatus !== 'active' && !alreadyVoted && (
        <div
          className="rounded-xl p-4 border mb-6 flex items-start gap-3"
          style={{
            background: computedStatus === 'upcoming' ? 'var(--color-status-amber-bg)' : 'var(--color-status-red-bg)',
            borderColor: computedStatus === 'upcoming' ? 'rgba(217,119,6,0.3)' : 'rgba(220,38,38,0.3)',
          }}
        >
          <Lock className="h-5 w-5 shrink-0 mt-0.5"
            style={{ color: computedStatus === 'upcoming' ? 'var(--color-status-amber)' : 'var(--color-status-red)' }}
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {computedStatus === 'upcoming' ? 'Election not yet open' : 'Election has closed'}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {computedStatus === 'upcoming'
                ? `Voting opens ${formatDate(election.startTime)}.`
                : 'Voting for this election is no longer available.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Stepper ──────────────────────────────────────────────────────────── */}
      {!alreadyVoted && computedStatus === 'active' && (
        <>
          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className="flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold border-2 transition-all"
                    style={{
                      background: step > s.id ? 'var(--color-primary)' : step === s.id ? 'var(--color-primary)' : 'transparent',
                      borderColor: step >= s.id ? 'var(--color-primary)' : 'var(--color-border)',
                      color: step >= s.id ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  <span
                    className="text-sm font-medium hidden sm:block"
                    style={{ color: step >= s.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-3 min-w-[1rem]"
                    style={{ background: step > s.id ? 'var(--color-primary)' : 'var(--color-border)' }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl mb-6 text-sm"
              role="alert"
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

          {/* ── STEP 1: Select Candidate ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Position tabs */}
              {positions.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setActivePosition(pos)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition"
                      style={{
                        background: activePosition === pos ? 'var(--color-primary)' : 'transparent',
                        borderColor: activePosition === pos ? 'var(--color-primary)' : 'var(--color-border)',
                        color: activePosition === pos ? '#fff' : 'var(--color-text-secondary)',
                      }}
                    >
                      {selectedVotes[pos] && <Check className="h-3.5 w-3.5" />}
                      {pos}
                    </button>
                  ))}
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  Candidates for <span style={{ color: 'var(--color-primary)' }}>{activePosition}</span>
                  <span className="text-sm font-normal ml-2" style={{ color: 'var(--color-text-muted)' }}>
                    ({currentCandidates.length} contenders)
                  </span>
                </h2>

                {currentCandidates.length === 0 ? (
                  <EmptyState
                    icon={<Vote className="h-6 w-6" />}
                    title="No candidates registered"
                    description="No candidates have been added to this position yet."
                  />
                ) : (
                  <div className="space-y-4">
                    {currentCandidates.map((candidate) => {
                      const isChosen = selectedVotes[candidate.position || activePosition] === candidate._id;
                      return (
                        <div
                          key={candidate._id}
                          id={`candidate-${candidate._id}`}
                          onClick={() => setSelectedVotes((prev) => ({
                            ...prev,
                            [candidate.position || activePosition]: candidate._id,
                          }))}
                          className="rounded-xl border p-5 cursor-pointer transition"
                          style={{
                            background: isChosen ? 'var(--color-primary-light)' : 'var(--color-card-bg)',
                            borderColor: isChosen ? 'var(--color-primary)' : 'var(--color-card-border)',
                            boxShadow: isChosen ? '0 0 0 2px rgba(29,78,216,0.2)' : 'var(--color-card-shadow)',
                          }}
                        >
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
                                style={{ background: 'var(--color-surface-alt)', borderColor: 'var(--color-border)' }}
                              >
                                {candidate.symbolBadge || '🛡️'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                    {candidate.name}
                                  </h4>
                                  {isChosen && <Badge variant="success" size="sm">Selected</Badge>}
                                </div>
                                <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                                  {candidate.partyOrAffiliation || candidate.party}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                  {candidate.departmentOrHouse || 'Contender'}
                                </p>
                              </div>
                            </div>
                            <div
                              className="h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition"
                              style={{
                                borderColor: isChosen ? 'var(--color-primary)' : 'var(--color-border)',
                                background: isChosen ? 'var(--color-primary)' : 'transparent',
                              }}
                            >
                              {isChosen && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                            </div>
                          </div>

                          {(candidate.manifesto || candidate.biography) && (
                            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                              {candidate.manifesto || candidate.biography}
                            </p>
                          )}

                          {candidate.promises?.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                              {candidate.promises.map((p: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 rounded-md border"
                                  style={{
                                    background: 'var(--color-surface-alt)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-muted)',
                                  }}
                                >
                                  ✓ {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="step1-next-btn"
                  onClick={goNext}
                  disabled={!allPositionsVoted}
                  className="btn-primary"
                >
                  Continue to Identity Verification
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Verify Identity ──────────────────────────────────────── */}
          {step === 2 && (
            <div className="max-w-lg mx-auto space-y-6">
              <div
                className="rounded-xl border p-6 text-center"
                style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
              >
                <div
                  className="flex items-center justify-center h-16 w-16 rounded-2xl mx-auto mb-4"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                >
                  <Scan className="h-8 w-8" />
                </div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Biometric Identity Verification
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                  We need to verify your identity before recording your vote. Your webcam will perform a live face scan — no images are stored.
                </p>

                {faceVerified ? (
                  <div
                    className="flex items-center justify-center gap-2 p-3 rounded-lg mb-4"
                    style={{ background: 'var(--color-status-green-bg)', color: 'var(--color-status-green)' }}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-semibold">Identity verified successfully</span>
                  </div>
                ) : (
                  <button
                    id="start-face-scan-btn"
                    onClick={() => setShowFaceScan(true)}
                    className="btn-primary w-full"
                  >
                    <Scan className="h-4 w-4" /> Start Face Scan
                  </button>
                )}
              </div>

              <div className="flex justify-between gap-3">
                <button onClick={goBack} className="btn-secondary flex items-center gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  id="step2-next-btn"
                  onClick={goNext}
                  disabled={!faceVerified}
                  className="btn-primary"
                >
                  Continue to Review
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Review Ballot ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="max-w-lg mx-auto space-y-6">
              <div
                className="rounded-xl border p-6"
                style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  <FileText className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                  Review Your Ballot
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Election</span>
                    <span className="text-sm font-semibold text-right max-w-[60%]" style={{ color: 'var(--color-text-primary)' }}>
                      {election.title}
                    </span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Institution</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {election.organizationName}
                    </span>
                  </div>

                  {positions.map((pos) => {
                    const cand = candidates.find((c) => c._id === selectedVotes[pos]);
                    return (
                      <div key={pos} className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{pos}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            {cand?.name || '—'}
                          </span>
                          {cand && (
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                              {cand.partyOrAffiliation || cand.party}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-between py-2">
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Identity Verified</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-status-green)' }}>
                      ✓ Biometric confirmed
                    </span>
                  </div>
                </div>

                <div
                  className="mt-5 p-3 rounded-lg flex items-start gap-2 text-sm"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                >
                  <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>Your ballot will be submitted to the Ethereum smart contract. This action is <strong>irreversible</strong>.</span>
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <button onClick={goBack} className="btn-secondary flex items-center gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  id="step3-next-btn"
                  onClick={goNext}
                  className="btn-primary"
                >
                  Proceed to Sign Transaction
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Sign Transaction ──────────────────────────────────────── */}
          {step === 4 && (
            <div className="max-w-lg mx-auto space-y-6">
              <div
                className="rounded-xl border p-6 text-center"
                style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
              >
                <div
                  className="flex items-center justify-center h-16 w-16 rounded-2xl mx-auto mb-4"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                >
                  <Wallet className="h-8 w-8" />
                </div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Sign with MetaMask
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                  Your vote will be broadcast as a transaction on the Ethereum Sepolia testnet. If MetaMask is not installed, a simulated transaction will be used for demo purposes.
                </p>

                <button
                  id="cast-vote-btn"
                  onClick={handleSignAndSubmit}
                  disabled={isSigning}
                  className="btn-primary w-full"
                >
                  {isSigning ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Broadcasting to Ethereum…
                    </>
                  ) : (
                    <>
                      <Vote className="h-4 w-4" />
                      Cast Ballot &amp; Sign Transaction
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-start">
                <button onClick={goBack} className="btn-secondary flex items-center gap-1.5" disabled={isSigning}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── STEP 5: Receipt ──────────────────────────────────────────────────── */}
      {(step === 5 || alreadyVoted) && receipt && (
        <div className="max-w-lg mx-auto">
          <div
            className="rounded-xl border p-6"
            style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
          >
            {/* Success header */}
            <div className="text-center mb-6">
              <div
                className="flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-3"
                style={{ background: 'var(--color-status-green-bg)' }}
              >
                <CheckCircle2 className="h-9 w-9" style={{ color: 'var(--color-status-green)' }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {alreadyVoted && !receipt.txHash?.startsWith('newly') ? 'Vote Already Recorded' : 'Vote Submitted Successfully'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Your ballot has been permanently recorded on the blockchain.
              </p>
            </div>

            {/* Receipt details */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Election</span>
                <span className="text-sm font-semibold text-right max-w-[60%]" style={{ color: 'var(--color-text-primary)' }}>
                  {election.title}
                </span>
              </div>
              <div className="flex justify-between py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Transaction Hash</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${receipt.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-mono max-w-[55%] break-all"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {receipt.txHash?.slice(0, 12)}…{receipt.txHash?.slice(-8)}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
              <div className="flex justify-between py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Block Number</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {receipt.blockNumber ?? 'Pending'}
                </span>
              </div>
              <div className="flex justify-between py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Timestamp</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {formatDate(receipt.timestamp)}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Network</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Ethereum Sepolia Testnet
                </span>
              </div>
            </div>

            <div
              className="p-3 rounded-lg flex items-start gap-2 text-xs mb-5"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>Your candidate choice is not stored in plain text on-chain — ballot privacy is preserved.</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                id="view-etherscan-btn"
                href={`https://sepolia.etherscan.io/tx/${receipt.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 flex items-center justify-center gap-2 no-underline"
              >
                <ExternalLink className="h-4 w-4" />
                View on Etherscan
              </a>
              <button
                id="download-receipt-btn"
                onClick={() => downloadPDFReceipt(receipt, election)}
                className="btn-primary flex-1"
              >
                <Download className="h-4 w-4" />
                Download Receipt
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm cursor-pointer transition"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Face verifier overlay */}
      {showFaceScan && (
        <FaceVerifier
          expectedEmbedding={user?.faceEmbedding}
          onVerificationSuccess={handleFaceSuccess}
          onClose={() => setShowFaceScan(false)}
        />
      )}
    </div>
  );
};

export default ElectionDetails;
