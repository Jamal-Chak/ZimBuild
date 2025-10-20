const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['general', 'career', 'partnership'],
    default: 'general'
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  position: {
    type: String,
    trim: true,
    maxlength: 100
  },
  experience: {
    type: String,
    enum: ['0-2', '3-5', '6-10', '10+']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  coverLetter: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'resolved', 'spam'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: String,
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  source: {
    type: String,
    enum: ['website', 'referral', 'social-media', 'other'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Indexes for better query performance
contactSchema.index({ type: 1, status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1, priority: -1 });

// Static method to get inquiry statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        total: { $sum: 1 },
        new: {
          $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
        },
        contacted: {
          $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] }
        },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats;
};

// Instance method to mark as contacted
contactSchema.methods.markAsContacted = function(notes = '') {
  this.status = 'contacted';
  if (notes) {
    this.notes.push({
      content: notes,
      createdBy: 'system'
    });
  }
  return this.save();
};

// Virtual for formatted phone number
contactSchema.virtual('formattedPhone').get(function() {
  if (!this.phone) return '';
  // Basic phone formatting for South Africa
  const cleaned = this.phone.replace(/\D/g, '');
  if (cleaned.startsWith('27')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return this.phone;
});

// Pre-save middleware to set priority based on type
contactSchema.pre('save', function(next) {
  if (this.type === 'career') {
    this.priority = 'high';
  } else if (this.type === 'partnership') {
    this.priority = 'medium';
  } else {
    this.priority = 'low';
  }
  next();
});

module.exports = mongoose.model('Contact', contactSchema);