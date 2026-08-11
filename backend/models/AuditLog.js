const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Null if it's an unauthenticated action
  },
  action: {
    type: String,
    required: [true, 'Audit action is required'],
    index: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    trim: true
  },
  deviceFingerprint: {
    type: String,
    trim: true
  },
  txHash: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  }
}, {
  timestamps: { createdAt: 'timestamp', updatedAt: false } // Only record creation time
});

// Indexes for analytical audit searches
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
