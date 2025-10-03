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
    maxlength: [500, 'Description cannot exceed 500 characters']
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
  artworks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork'
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Update artwork count virtual
collectionSchema.virtual('artworksCount').get(function() {
  return this.artworks.length;
});

// Indexes
collectionSchema.index({ owner: 1, createdAt: -1 });
collectionSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Collection', collectionSchema);