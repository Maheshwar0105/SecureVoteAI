const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true,
    maxlength: [100, 'Candidate name cannot exceed 100 characters']
  },
  position: {
    type: String,
    trim: true,
    default: 'Candidate'
  },
  party: {
    type: String,
    required: [true, 'Party affiliation or group is required'],
    trim: true
  },
  partyOrAffiliation: {
    type: String,
    trim: true,
    default: 'Independent'
  },
  organizationType: {
    type: String,
    enum: ['general', 'college', 'company', 'school'],
    default: 'general'
  },
  departmentOrHouse: {
    type: String,
    trim: true,
    default: ''
  },
  symbolBadge: {
    type: String,
    trim: true,
    default: '🛡️'
  },
  biography: {
    type: String,
    required: [true, 'Biography is required']
  },
  manifesto: {
    type: String,
    required: [true, 'Manifesto is required']
  },
  promises: {
    type: [String],
    default: []
  },
  photoUrl: {
    type: String,
    default: ''
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: [true, 'Election reference is required']
  },
  education: {
    type: String,
    trim: true
  },
  achievements: {
    type: [String],
    default: []
  },
  socialLinks: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
CandidateSchema.index({ electionId: 1 });
CandidateSchema.index({ party: 1 });

// Soft Delete Middleware
CandidateSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

CandidateSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model('Candidate', CandidateSchema);
