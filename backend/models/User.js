const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true, // Allow null values to be unique for non-wallet users
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: ''
  },
  voterId: {
    type: String,
    trim: true,
    uppercase: true,
    default: ''
  },
  organizationType: {
    type: String,
    enum: ['general', 'college', 'company', 'school'],
    default: 'general'
  },
  organizationId: {
    type: String,
    trim: true,
    default: ''
  },
  organizationName: {
    type: String,
    trim: true,
    default: ''
  },
  department: {
    type: String,
    trim: true,
    default: ''
  },
  yearOrGrade: {
    type: String,
    trim: true,
    default: ''
  },
  house: {
    type: String,
    trim: true,
    default: ''
  },
  faceEmbedding: {
    type: [Number], // Storing face descriptors for face verification matching
    default: undefined
  },
  role: {
    type: String,
    enum: ['voter', 'officer', 'admin'],
    default: 'voter'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isWalletBound: {
    type: Boolean,
    default: false
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

// Indexes for fast lookup
UserSchema.index({ role: 1 });

// Soft Delete Middleware to filter out deleted users
UserSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

UserSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model('User', UserSchema);
