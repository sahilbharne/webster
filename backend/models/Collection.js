// models/Collection.js
import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    maxlength: [100, 'Collection name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clerkUserId: {
    type: String,
    required: [true, 'Clerk User ID is required']
  },
  artworks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['personal', 'inspiration', 'work', 'favorites', 'other'],
    default: 'personal'
  }
}, {
  timestamps: true
});

// Virtual for artwork count
collectionSchema.virtual('artworksCount').get(function() {
  return this.artworks.length;
});

// Virtual for formatted date
collectionSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Indexes for better performance
collectionSchema.index({ owner: 1, createdAt: -1 });
collectionSchema.index({ clerkUserId: 1, createdAt: -1 });
collectionSchema.index({ name: 'text', description: 'text' });
collectionSchema.index({ isPublic: 1 });
collectionSchema.index({ tags: 1 });

// Static method to find public collections
collectionSchema.statics.findPublic = function(query = {}) {
  return this.find({ 
    ...query, 
    isPublic: true 
  })
    .populate('owner', 'username firstName lastName profileImage')
    .populate('artworks', 'title imageUrl artistName likes views')
    .sort({ createdAt: -1 });
};

// Static method to find user's collections
collectionSchema.statics.findByUserId = function(clerkUserId) {
  return this.find({ clerkUserId })
    .populate('artworks', 'title imageUrl artistName likes views cloudinaryId')
    .sort({ createdAt: -1 });
};

// Method to add artwork to collection
collectionSchema.methods.addArtwork = async function(artworkId) {
  if (!this.artworks.includes(artworkId)) {
    this.artworks.push(artworkId);
    await this.save();
  }
  return this;
};

// Method to remove artwork from collection
collectionSchema.methods.removeArtwork = async function(artworkId) {
  this.artworks = this.artworks.filter(id => id.toString() !== artworkId.toString());
  await this.save();
  return this;
};

// Method to update cover image from first artwork
collectionSchema.methods.updateCoverImage = async function() {
  if (this.artworks.length > 0) {
    const Artwork = mongoose.model('Artwork');
    const firstArtwork = await Artwork.findById(this.artworks[0]);
    if (firstArtwork) {
      this.coverImage = firstArtwork.imageUrl;
      await this.save();
    }
  }
  return this;
};

export default mongoose.model('Collection', collectionSchema);