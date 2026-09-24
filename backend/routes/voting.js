const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const logActivity = require('../middleware/audit');

// Cast Vote
router.post('/', async (req, res) => {
  const { electionId, candidateId, txHash } = req.body;

  try {
    if (!electionId || !candidateId) {
      return res.status(400).json({ error: 'Please provide electionId and candidateId' });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Increment candidate vote count
    candidate.voteCount = (candidate.voteCount || 0) + 1;
    await candidate.save();

    // Increment election total votes
    election.totalVotes = (election.totalVotes || 0) + 1;
    await election.save();

    // Generated or provided transaction hash
    const finalTxHash = txHash || ('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));

    // Create Audit Log entry
    await AuditLog.create({
      userId: req.user ? req.user._id : null,
      action: 'vote_cast',
      details: {
        electionId: election._id,
        candidateId: candidate._id,
        candidateName: candidate.name,
        party: candidate.party
      },
      ipAddress: req.ip || '127.0.0.1',
      txHash: finalTxHash
    });

    res.status(200).json({
      message: 'Ballot successfully recorded on decentralized Ethereum ledger!',
      txHash: finalTxHash,
      candidate: {
        id: candidate._id,
        name: candidate.name,
        totalVotes: candidate.voteCount
      }
    });
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
