const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 300
  },
  category: {
    type: String,
    required: true,
    enum: ['commercial', 'residential', 'infrastructure', 'healthcare', 'education', 'other']
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  status: {
    type: String,
    required: true,
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning'
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  startDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  budget: {
    amount: Number,
    currency: {
      type: String,
      default: 'ZAR'
    }
  },
  size: {
    value: Number,
    unit: {
      type: String,
      default: 'sqm'
    }
  },
  client: {
    name: String,
    website: String,
    logo: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String
  },
  challenges: [{
    title: String,
    description: String,
    solution: String
  }],
  achievements: [{
    title: String,
    description: String
  }],
  team: [{
    name: String,
    role: String,
    department: String
  }],
  timeline: [{
    phase: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed'],
      default: 'planned'
    },
    description: String
  }],
  views: {
    type: Number,
    default: 0
  },
  meta: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ featured: -1, status: 1 });
projectSchema.index({ status: 1, completionDate: -1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ 'client.name': 1 });
projectSchema.index({ slug: 1 });

// Pre-save middleware to generate slug
projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  }
  next();
});

// Pre-save middleware to set short description
projectSchema.pre('save', function(next) {
  if (this.isModified('description') && !this.shortDescription) {
    this.shortDescription = this.description.substring(0, 297) + '...';
  }
  next();
});

// Static method to get project statistics
projectSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$category',
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
        },
        totalBudget: { $sum: '$budget.amount' },
        totalSize: { $sum: '$size.value' }
      }
    }
  ]);

  const totalStats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
        totalViews: { $sum: '$views' },
        featuredProjects: {
          $sum: { $cond: ['$featured', 1, 0] }
        },
        avgBudget: { $avg: '$budget.amount' }
      }
    }
  ]);

  return {
    byCategory: stats,
    overall: totalStats[0] || {}
  };
};

// Static method to get featured projects
projectSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ 
    featured: true, 
    status: 'completed' 
  })
  .sort({ completionDate: -1 })
  .limit(limit)
  .select('title slug category location images shortDescription completionDate');
};

// Static method to get projects by category
projectSchema.statics.getByCategory = function(category, limit = 10) {
  const query = { status: 'completed' };
  if (category && category !== 'all') {
    query.category = category;
  }
  
  return this.find(query)
    .sort({ completionDate: -1 })
    .limit(limit)
    .select('title slug category location images shortDescription completionDate');
};

// Instance method to mark as featured
projectSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

// Instance method to add image
projectSchema.methods.addImage = function(imageData) {
  this.images.push(imageData);
  return this.save();
};

// Instance method to set primary image
projectSchema.methods.setPrimaryImage = function(imageId) {
  // Reset all images to non-primary
  this.images.forEach(image => {
    image.isPrimary = false;
  });
  
  // Set the specified image as primary
  const image = this.images.id(imageId);
  if (image) {
    image.isPrimary = true;
  }
  
  return this.save();
};

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (!this.startDate || !this.completionDate) return null;
  
  const durationMs = this.completionDate - this.startDate;
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  const durationMonths = Math.ceil(durationDays / 30);
  
  if (durationMonths >= 12) {
    const years = Math.floor(durationMonths / 12);
    const months = durationMonths % 12;
    return months > 0 ? `${years}y ${months}m` : `${years}y`;
  }
  
  return `${durationMonths}m`;
});

// Virtual for project status text
projectSchema.virtual('statusText').get(function() {
  const statusMap = {
    'planning': 'In Planning',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'on-hold': 'On Hold'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for formatted budget
projectSchema.virtual('formattedBudget').get(function() {
  if (!this.budget || !this.budget.amount) return 'Not disclosed';
  
  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: this.budget.currency || 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(this.budget.amount);
});

// Virtual for formatted size
projectSchema.virtual('formattedSize').get(function() {
  if (!this.size || !this.size.value) return '';
  
  const formatter = new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return `${formatter.format(this.size.value)} ${this.size.unit}`;
});

module.exports = mongoose.model('Project', projectSchema);