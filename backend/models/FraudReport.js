const mongoose = require('mongoose');

const FraudReportSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: [true, 'Election ID is required']
  },
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Voter ID is required']
  },
  riskScore: {
    type: Number,
    required: [true, 'Risk score is required'],
    min: 0.0,
    max: 1.0
  },
  reasons: {
    type: [String],
    default: []
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'ignored'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for admin dashboard lookups
FraudReportSchema.index({ electionId: 1 });
FraudReportSchema.index({ voterId: 1 });
FraudReportSchema.index({ riskScore: -1 });
FraudReportSchema.index({ status: 1 });

module.exports = mongoose.model('FraudReport', FraudReportSchema);
