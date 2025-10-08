// models/Follow.js
import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
  followerId: {
    type: String, // Clerk user ID of the person who follows
    required: true
  },
  followingId: {
    type: String, // Clerk user ID of the person being followed
    required: true
  },
  // Add references to User model for population
  followerUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure a user can only follow another user once
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default mongoose.model('Follow', followSchema);