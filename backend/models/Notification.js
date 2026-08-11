const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Null indicates a broadcast notification to all users
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'alert'],
    default: 'info'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
NotificationSchema.index({ userId: 1, isRead: 1 });

// Soft Delete Middleware
NotificationSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

NotificationSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model('Notification', NotificationSchema);
