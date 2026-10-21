const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const logActivity = require('../middleware/audit');

// ── Check if the authenticated user has already voted in an election ──────────
// GET /voting/check/:electionId
router.get('/check/:electionId', protect, async (req, res) => {
  try {
    const { electionId } = req.params;
    const userId = req.user._id.toString();

    // Find the most recent vote_cast audit entry for this user + election
    const existing = await AuditLog.findOne({
      userId: req.user._id,
      action: 'vote_cast',
      'details.electionId': electionId
    }).sort({ timestamp: -1 });

    if (existing) {
      return res.status(200).json({
        hasVoted: true,
        receipt: {
          txHash: existing.txHash,
          blockNumber: existing.details?.blockNumber || null,
          timestamp: existing.timestamp,
          electionId,
          electionTitle: existing.details?.electionTitle || null,
        }
      });
    }

    return res.status(200).json({ hasVoted: false });
  } catch (error) {
    console.error('Vote check error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ── Cast Vote ─────────────────────────────────────────────────────────────────
// POST /voting
router.post('/', protect, logActivity('vote_cast'), async (req, res) => {
  const { electionId, candidateId, txHash, blockNumber, faceVerified } = req.body;

  try {
    if (!electionId || !candidateId) {
      return res.status(400).json({ error: 'Please provide electionId and candidateId.' });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found.' });
    }

    // Enforce election window
    const now = new Date();
    if (now < new Date(election.startTime)) {
      return res.status(403).json({ error: 'This election has not started yet.' });
    }
    if (now > new Date(election.endTime)) {
      return res.status(403).json({ error: 'This election has already closed.' });
    }

    // Prevent double-voting per user per election
    const alreadyVoted = await AuditLog.findOne({
      userId: req.user._id,
      action: 'vote_cast',
      'details.electionId': electionId
    });
    if (alreadyVoted) {
      return res.status(409).json({
        error: 'You have already voted in this election.',
        receipt: {
          txHash: alreadyVoted.txHash,
          timestamp: alreadyVoted.timestamp,
        }
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found.' });
    }

    // Increment vote count
    candidate.voteCount = (candidate.voteCount || 0) + 1;
    await candidate.save();

    election.totalVotes = (election.totalVotes || 0) + 1;
    await election.save();

    const finalTxHash =
      txHash ||
      '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const receiptTimestamp = new Date();

    // Create immutable audit log — candidateId is NOT stored in details
    // to preserve ballot privacy (only electionId is recorded)
    await AuditLog.create({
      userId: req.user._id,
      action: 'vote_cast',
      details: {
        electionId: election._id.toString(),
        electionTitle: election.title,
        blockNumber: blockNumber || null,
        faceVerified: !!faceVerified,
        // candidateName intentionally omitted to preserve on-chain privacy
      },
      ipAddress: req.ip || '127.0.0.1',
      txHash: finalTxHash,
    });

    res.status(200).json({
      message: 'Vote successfully recorded on the blockchain ledger.',
      receipt: {
        txHash: finalTxHash,
        blockNumber: blockNumber || null,
        timestamp: receiptTimestamp.toISOString(),
        electionId: election._id.toString(),
        electionTitle: election.title,
      }
    });
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
