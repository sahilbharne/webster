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

  
  try {
    const Artwork = mongoose.model('Artwork');
    const Follow = mongoose.model('Follow');
    const Collection = mongoose.model('Collection');

    // Use aggregation for better performance - processes in database
    const artworkStats = await Artwork.aggregate([
      { 
        $match: { 
          clerkUserId: this.clerkUserId,
          isDeleted: { $ne: true }, // Exclude soft-deleted
          status: 'published' // Only count published artworks
        } 
      },
      {
        $group: {
          _id: null,
          artworkCount: { $sum: 1 },
          totalLikes: { $sum: { $size: "$likes" } },
          totalViews: { $sum: "$views" }
        }
      }
    ]);

    // Get followers count
    const followersCount = await Follow.countDocuments({ 
      followingUser: this._id 
    });

    // Get following count  
    const followingCount = await Follow.countDocuments({ 
      followerUser: this._id 
    });

    // Get collections count
    const collectionsCount = await Collection.countDocuments({ 
      owner: this._id,
      isDeleted: { $ne: true }
    });

    // Update stats
    const stats = artworkStats[0] || { artworkCount: 0, totalLikes: 0, totalViews: 0 };
    
    this.stats = {
      artworksCount: stats.artworkCount,
      totalLikes: stats.totalLikes,
      totalViews: stats.totalViews,
      followersCount: followersCount,
      followingCount: followingCount,
      collectionsCount: collectionsCount,
      updatedAt: new Date()
    };

    await this.save();
    
    console.log(`✅ Stats updated for user ${this.clerkUserId}:`, this.stats);
    return this.stats;

  } catch (error) {
    console.error('❌ Error updating user stats:', error);
    throw error;
  }
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

userSchema.statics.findOrCreateFromClerk = async function(clerkUser) {
  const { 
    id: clerkUserId, 
    primaryEmailAddress, 
    username, 
    firstName, 
    lastName, 
    profileImageUrl, // Clerk's field name
    lastSignInAt,
    externalAccounts,
    publicMetadata // Clerk's publicMetadata
  } = clerkUser;

  const email = primaryEmailAddress?.emailAddress?.toLowerCase();

  if (!clerkUserId || !email) {
    throw new Error('Clerk User ID and Email are required to sync user.');
  }

  let user = await this.findOne({ clerkUserId: clerkUserId });

  // Prepare fields for update or creation
  // Ensure username generation is robust if Clerk's is null or empty
  let newUsername = username || email.split('@')[0]; // Fallback to email prefix
  
  // IMPORTANT: If username is required and unique, you might need more advanced
  // generation for new users to avoid duplicates if `email.split('@')[0]` also clashes.
  // For existing users, if their username is being updated and it's taken, Mongoose unique validation will throw.

  const updateFields = {
    email: email, // Already lowercased above
    firstName: firstName || '',
    lastName: lastName || '',
    profileImage: profileImageUrl || '', // Map Clerk's profileImageUrl to your schema's profileImage
    clerkData: { // Always update clerkData block
      lastSignInAt: lastSignInAt,
      externalAccounts: externalAccounts?.map(acc => ({
        provider: acc.provider,
        providerUserId: acc.providerUserId
      })) || []
    },
    // The `bio`, `website`, `socialLinks`, `preferences` etc. are usually managed
    // by your app's frontend and stored as publicMetadata in Clerk, or directly
    // on your backend user model, but not usually overwritten by a *sync* operation
    // unless you intend Clerk's publicMetadata to fully control these.
    // If Clerk's publicMetadata contains your `bio`, `website` etc., then:
    bio: publicMetadata?.bio || '',
    website: publicMetadata?.website || '',
    socialLinks: publicMetadata?.socialLinks || {},
    // ... any other fields you want to pull from publicMetadata
  };
  
  // Handle username separately due to its required/unique constraint
  if (newUsername) {
    updateFields.username = newUsername;
  }
  
  let isNewUser = false;

  if (user) {
    // User found by Clerk ID: Update existing record
    // We only update if fields have actually changed to avoid unnecessary DB writes
    Object.assign(user, updateFields);
    // If the username from Clerk is different, attempt to update it
    if (user.username !== newUsername && newUsername) {
        user.username = newUsername;
    }
    await user.save(); // Save the updated user (this will run validators)
    console.log('✅ User updated in backend by Clerk ID:', user.email);
  } else {
    // User NOT found by Clerk ID: Try to find by email
    user = await this.findOne({ email: email });

    if (user) {
      // User found by email (e.g., existing user before Clerk integration)
      // Link the Clerk ID and update other fields
      user.clerkUserId = clerkUserId; // <--- CRITICAL: LINK CLERK ID HERE
      Object.assign(user, updateFields);
      if (user.username !== newUsername && newUsername) {
          user.username = newUsername;
      }
      await user.save();
      console.log('✅ User found by email and updated with Clerk ID:', user.email);
    } else {
      // User not found by either Clerk ID or email: Create a new user
      isNewUser = true;
      user = new this({
        clerkUserId,
        ...updateFields, // Spreads email, firstName, lastName, profileImage, clerkData, bio, website, socialLinks
        username: newUsername, // Use the determined username for creation
        createdAt: new Date(), // Set creation date
      });
      await user.save(); // This will also run validators for required fields
      console.log('✨ New user created in backend:', user.email);
    }
  }
  
  return user;
};

// Add these methods to your User.js model

// Method to follow a user
userSchema.methods.follow = async function (artistClerkId) {
  const Follow = mongoose.model('Follow');
  
  const follow = new Follow({
    followerId: this.clerkUserId,
    followingId: artistClerkId
  });
  
  await follow.save();
  
  // Update stats
  await User.findOneAndUpdate(
    { clerkUserId: artistClerkId },
    { $inc: { 'stats.followersCount': 1 } }
  );
  
  await User.findOneAndUpdate(
    { clerkUserId: this.clerkUserId },
    { $inc: { 'stats.followingCount': 1 } }
  );
};

// Method to unfollow a user
userSchema.methods.unfollow = async function (artistClerkId) {
  const Follow = mongoose.model('Follow');
  
  await Follow.findOneAndDelete({
    followerId: this.clerkUserId,
    followingId: artistClerkId
  });
  
  // Update stats
  await User.findOneAndUpdate(
    { clerkUserId: artistClerkId },
    { $inc: { 'stats.followersCount': -1 } }
  );
  
  await User.findOneAndUpdate(
    { clerkUserId: this.clerkUserId },
    { $inc: { 'stats.followingCount': -1 } }
  );
};

// Method to check if following a user
userSchema.methods.isFollowing = async function (artistClerkId) {
  const Follow = mongoose.model('Follow');
  
  const follow = await Follow.findOne({
    followerId: this.clerkUserId,
    followingId: artistClerkId
  });
  
  return !!follow;
};

export default mongoose.model('User', userSchema);