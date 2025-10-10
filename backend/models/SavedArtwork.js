import mongoose from 'mongoose';

const savedArtworkSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  }, // clerkUserId
  artworkId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artwork', 
    required: true 
  },
  savedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Prevent duplicate saves
savedArtworkSchema.index({ userId: 1, artworkId: 1 }, { unique: true });

export default mongoose.model('SavedArtwork', savedArtworkSchema);