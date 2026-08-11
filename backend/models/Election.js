const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Election title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
    validate: {
      validator: function(value) {
        return this.startTime < value;
      },
      message: 'End time must be after start time'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'completed'],
    default: 'draft'
  },
  electionType: {
    type: String,
    enum: ['general', 'college', 'company', 'school'],
    default: 'general'
  },
  organizationName: {
    type: String,
    trim: true,
    default: 'SecureVote Global Network'
  },
  category: {
    type: String,
    trim: true,
    default: 'General Election'
  },
  contestedPositions: {
    type: [String],
    default: ['Representative']
  },
  eligibleDepartments: {
    type: [String],
    default: ['All']
  },
  eligibleYearsOrGrades: {
    type: [String],
    default: ['All']
  },
  contractAddress: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rules: {
    type: [String],
    default: []
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
ElectionSchema.index({ status: 1 });
ElectionSchema.index({ startTime: 1, endTime: 1 });

// Soft Delete Middleware
ElectionSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

ElectionSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model('Election', ElectionSchema);
