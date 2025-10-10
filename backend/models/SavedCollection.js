import mongoose from 'mongoose';

const savedCollectionSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  }, // clerkUserId
  collectionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Collection', 
    required: true 
  },
  savedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Prevent duplicate saves
savedCollectionSchema.index({ userId: 1, collectionId: 1 }, { unique: true });

export default mongoose.model('SavedCollection', savedCollectionSchema);