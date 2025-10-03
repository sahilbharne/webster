import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  cloudinaryId: {
    type: String,
    required: [true, 'Cloudinary ID is required']
  },
  artistName: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['digital', 'photography', 'painting', '3d', 'abstract'],
      message: 'Category must be digital, photography, painting, 3d, or abstract'
    }
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    min: 0
  },
  dimensions: {
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
artworkSchema.index({ title: 'text', description: 'text', tags: 'text' });
artworkSchema.index({ category: 1, createdAt: -1 });
artworkSchema.index({ artistId: 1, createdAt: -1 });
artworkSchema.index({ likes: -1 });
artworkSchema.index({ views: -1 });

// Virtual for formatted date
artworkSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

export default mongoose.model('Artwork', artworkSchema);