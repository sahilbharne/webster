import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Clerk authentication fields
  clerkUserId: {
    type: String,
    required: [true, 'Clerk User ID is required'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  profileImage: {
    type: String,
    default: ''
  },
  
  // Additional profile fields
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  socialLinks: {
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    behance: {
      type: String,
      default: ''
    },
    dribbble: {
      type: String,
      default: ''
    }
  },
  
  // Role and status
  role: {
    type: String,
    enum: ['user', 'artist', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // User statistics
  stats: {
    artworksCount: {
      type: Number,
      default: 0
    },
    followersCount: {
      type: Number,
      default: 0
    },
    followingCount: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    collectionsCount: {
      type: Number,
      default: 0
    }
  },
  
  // User preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    publicProfile: {
      type: Boolean,
      default: true
    },
    showSocialLinks: {
      type: Boolean,
      default: true
    },
    allowMessages: {
      type: Boolean,
      default: true
    }
  },
  
  // Clerk metadata
  clerkData: {
    lastSignInAt: Date,
    externalAccounts: [{
      provider: String,
      providerUserId: String
    }]
  }
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`.trim();
  }
  return this.username;
});

// Virtual for display name (falls back to username)
userSchema.virtual('displayName').get(function() {
  if (this.firstName) {
    return this.firstName;
  }
  return this.username;
});

// Method to update stats
userSchema.methods.updateStats = async function() {
  const Artwork = mongoose.model('Artwork');
  
  const userArtworks = await Artwork.find({ clerkUserId: this.clerkUserId });
  
  const artworkCount = userArtworks.length;
  const totalLikes = userArtworks.reduce((sum, artwork) => sum + artwork.likes.length, 0);
  const totalViews = userArtworks.reduce((sum, artwork) => sum + (artwork.views || 0), 0);
  
  this.stats.artworksCount = artworkCount;
  this.stats.totalLikes = totalLikes;
  this.stats.totalViews = totalViews;
  
  await this.save();
};

// Method to update total likes across all artworks

userSchema.methods.updateTotalLikes = async function() {
  const Artwork = mongoose.model('Artwork');
  
  // Calculate total likes across all user's artworks
  const userArtworks = await Artwork.find({ clerkUserId: this.clerkUserId });
  const totalLikes = userArtworks.reduce((sum, artwork) => sum + artwork.likes.length, 0);
  
  this.stats.totalLikes = totalLikes;
  await this.save();
  
  return totalLikes;
};

// Method to get public profile (excludes sensitive data)
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.clerkData;
  delete userObject.preferences;
  delete userObject.__v;
  
  return userObject;
};

// Static method to find by Clerk ID
userSchema.statics.findByClerkId = function(clerkUserId) {
  return this.findOne({ clerkUserId });
};

// Static method to find or create from Clerk data
userSchema.statics.findOrCreateFromClerk = async function(clerkUser) {
  let user = await this.findOne({ clerkUserId: clerkUser.id });
  
  if (!user) {
    user = new this({
      clerkUserId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress,
      username: clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress.split('@')[0],
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      profileImage: clerkUser.profileImageUrl,
      clerkData: {
        lastSignInAt: clerkUser.lastSignInAt,
        externalAccounts: clerkUser.externalAccounts?.map(acc => ({
          provider: acc.provider,
          providerUserId: acc.providerUserId
        }))
      }
    });
    
    await user.save();
  }
  
  return user;
};

export default mongoose.model('User', userSchema);