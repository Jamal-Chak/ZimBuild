const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  source: {
    type: String,
    enum: ['website', 'event', 'referral', 'social-media', 'other'],
    default: 'website'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    projectUpdates: {
      type: Boolean,
      default: true
    },
    companyNews: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    signupPage: String,
    referrer: String
  },
  lastEngagement: {
    type: Date,
    default: Date.now
  },
  engagementCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ isActive: 1 });
subscriberSchema.index({ createdAt: -1 });
subscriberSchema.index({ 'preferences.newsletter': 1 });

// Static method to get subscription statistics
subscriberSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalSubscribers: { $sum: 1 },
        activeSubscribers: {
          $sum: { $cond: ['$isActive', 1, 0] }
        },
        newThisMonth: {
          $sum: {
            $cond: [
              {
                $gte: [
                  '$createdAt',
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  const sourceStats = await this.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    overall: stats[0] || {},
    bySource: sourceStats
  };
};

// Static method to find active subscribers
subscriberSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ email: 1 });
};

// Static method to unsubscribe by email
subscriberSchema.statics.unsubscribe = async function(email) {
  const subscriber = await this.findOne({ email: email.toLowerCase() });
  if (subscriber) {
    subscriber.isActive = false;
    await subscriber.save();
  }
  return subscriber;
};

// Static method to update engagement
subscriberSchema.statics.updateEngagement = async function(email) {
  const subscriber = await this.findOne({ email: email.toLowerCase() });
  if (subscriber) {
    subscriber.lastEngagement = new Date();
    subscriber.engagementCount += 1;
    await subscriber.save();
  }
  return subscriber;
};

// Instance method to update preferences
subscriberSchema.methods.updatePreferences = function(newPreferences) {
  this.preferences = { ...this.preferences, ...newPreferences };
  return this.save();
};

// Instance method to reactivate
subscriberSchema.methods.reactivate = function() {
  this.isActive = true;
  this.lastEngagement = new Date();
  return this.save();
};

// Pre-save middleware to validate active status with preferences
subscriberSchema.pre('save', function(next) {
  // If all preferences are false, automatically deactivate
  const hasActivePreference = Object.values(this.preferences).some(pref => pref === true);
  if (!hasActivePreference) {
    this.isActive = false;
  }
  next();
});

module.exports = mongoose.model('Subscriber', subscriberSchema);