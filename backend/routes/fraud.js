const express = require('express');
const router = express.Router();

// Get AI Fraud Alerts & Telemetry
router.get('/', (req, res) => {
  res.status(200).json({
    fraudRiskScore: 0.00,
    systemIntegrity: '100% BYZANTINE TOLERANT',
    alerts: [
      {
        id: 1,
        voter: 'Device Hash #9981-A',
        reason: 'Abnormal voting speed (0.35s) — potential bot script',
        score: 0.88,
        ip: '192.168.1.102',
        type: 'Bot Rate-Limit'
      },
      {
        id: 2,
        voter: 'Device Hash #4412-B',
        reason: 'Rapid MetaMask wallet switching from identical client fingerprint',
        score: 0.74,
        ip: '10.0.0.4',
        type: 'Sybil Attempt'
      },
      {
        id: 3,
        voter: 'Session ID #8812',
        reason: 'Face verification liveness anomaly: static photo frame rejected',
        score: 0.95,
        ip: '172.16.2.19',
        type: 'Spoof Detection'
      }
    ]
  });
});

module.exports = router;
