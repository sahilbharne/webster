import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Import auto-tagger
import { analyzeImage } from './ai_services/vision_api_services/auto_tagger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create uploads directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('No MongoDB URI found, using mock data');
    }
  } catch (error) {
    console.log('Using mock data - MongoDB connection failed:', error.message);
  }
};

// Simple Artwork Schema
const artworkSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  artistName: String,
  category: String,
  tags: [String],
  likes: Number,
  views: Number,
  isPublic: Boolean,
  price: Number
}, {
  timestamps: true
});

const Artwork = mongoose.model('Artwork', artworkSchema);

// ==================== AUTO-TAGGER ROUTES ====================

// POST /api/auto-tag - Generate tags for an image
app.post('/api/auto-tag', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image file provided' 
      });
    }

    console.log('🔄 Processing image for auto-tagging:', req.file.filename);
    
    const imagePath = req.file.path;
    
    // Analyze image with Google Vision API
    const analysis = await analyzeImage(imagePath);
    
    // Extract tags from labels (top 10 most relevant)
    const tags = analysis.labels
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10)
      .map(label => label.description);
    
    // Extract safe search results
    const safeSearch = analysis.safeSearch;
    
    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    console.log('✅ Generated tags:', tags);

    res.json({
      success: true,
      tags: tags,
      safeSearch: safeSearch,
      message: `Generated ${tags.length} tags automatically`
    });

  } catch (error) {
    console.error('❌ Auto-tag error:', error);
    
    // Clean up file if exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
});

// POST /api/upload-with-tags - Upload artwork with auto-generated tags
app.post('/api/upload-with-tags', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image file provided' 
      });
    }

    const { title, description, artistName, category, price, customTags } = req.body;
    
    console.log('🔄 Uploading artwork with auto-tags...');
    
    const imagePath = req.file.path;
    
    // Step 1: Generate auto-tags
    const analysis = await analyzeImage(imagePath);
    const autoTags = analysis.labels
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 8)
      .map(label => label.description);

    // Step 2: Combine with custom tags
    let allTags = [...autoTags];
    if (customTags) {
      const parsedCustomTags = typeof customTags === 'string' 
        ? customTags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : customTags;
      allTags = [...new Set([...allTags, ...parsedCustomTags])];
    }

    // Step 3: Create artwork data
    const artworkData = {
      title: title || 'Untitled Artwork',
      description: description || 'No description provided',
      imageUrl: `/uploads/${req.file.filename}`, // You might want to upload to Cloudinary instead
      artistName: artistName || 'Anonymous Artist',
      category: category || 'digital',
      tags: allTags,
      isPublic: true,
      price: price ? parseFloat(price) : 0,
      likes: 0,
      views: 0
    };

    // Step 4: Save to database or mock
    let artwork;
    if (mongoose.connection.readyState === 1) {
      artwork = new Artwork(artworkData);
      await artwork.save();
    } else {
      // Create mock artwork
      artwork = {
        _id: Date.now().toString(),
        ...artworkData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    console.log('✅ Artwork uploaded with tags:', allTags);

    res.status(201).json({
      success: true,
      message: 'Artwork uploaded successfully with auto-generated tags!',
      artwork: artwork,
      autoTags: autoTags,
      totalTags: allTags.length
    });

  } catch (error) {
    console.error('❌ Upload with tags error:', error);
    
    // Clean up file if exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload artwork',
      details: error.message 
    });
  }
});

// ==================== EXISTING ROUTES (Keep all your current routes) ====================

// Basic route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Grand Gallery API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    features: ['auto-tagging', 'artwork-upload', 'search']
  });
});

// ✅ ADD THIS SAMPLE ARTWORKS ROUTE
app.post('/api/artworks/sample', async (req, res) => {
  try {
    console.log('🔄 Adding sample artworks to database...');
    
    const sampleArtworks = [
      {
        title: "Sunset Mountains",
        artistName: "Nature Lover",
        description: "A beautiful painting of mountains during sunset with vibrant colors painting the sky",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 15,
        tags: ["nature", "mountains", "sunset", "landscape"],
        category: "painting",
        isPublic: true,
        price: 0,
        views: 0
      },
      {
        title: "Abstract Dreams",
        artistName: "Modern Artist",
        description: "Colorful abstract artwork representing dreams and imagination",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 23,
        tags: ["abstract", "colorful", "modern", "dreams"],
        category: "abstract",
        isPublic: true,
        price: 0,
        views: 0
      },
      {
        title: "Ocean Waves",
        artistName: "Sea Artist", 
        description: "Powerful ocean waves crashing against rocky cliffs at golden hour",
        imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 8,
        tags: ["ocean", "waves", "nature", "water"],
        category: "photography",
        isPublic: true,
        price: 0,
        views: 0
      }
    ];

    let createdArtworks;

    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected - insert into database
      createdArtworks = await Artwork.insertMany(sampleArtworks);
      console.log(`✅ Added ${createdArtworks.length} sample artworks to database`);
    } else {
      // Fallback to mock data
      createdArtworks = sampleArtworks.map((artwork, index) => ({
        _id: (Date.now() + index).toString(),
        ...artwork,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      console.log(`✅ Created ${createdArtworks.length} sample artworks (mock data)`);
    }
    
    res.json({ 
      success: true,
      message: 'Sample artworks added successfully!', 
      count: createdArtworks.length,
      artworks: createdArtworks 
    });
  } catch (error) {
    console.error('❌ Error adding sample artworks:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to add sample artworks' 
    });
  }
});

// Get all artworks with filters and pagination
app.get('/api/artworks', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = { isPublic: true };
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { artistName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Try to get data from MongoDB
    let artworks = [];
    let total = 0;

    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      artworks = await Artwork.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      total = await Artwork.countDocuments(query);
    } else {
      // Fallback to mock data
      artworks = getMockArtworks().slice(skip, skip + limit);
      total = getMockArtworks().length;
    }

    res.json({
      success: true,
      artworks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      hasMore: page < Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    // Fallback to mock data on error
    const mockArtworks = getMockArtworks();
    res.json({
      success: true,
      artworks: mockArtworks.slice(0, 12),
      totalPages: 1,
      currentPage: 1,
      total: mockArtworks.length,
      hasMore: false
    });
  }
});

// Get single artwork
app.get('/api/artworks/:id', async (req, res) => {
  try {
    let artwork;

    if (mongoose.connection.readyState === 1) {
      artwork = await Artwork.findById(req.params.id);
      
      if (artwork) {
        // Increment views
        artwork.views += 1;
        await artwork.save();
      }
    }

    if (!artwork) {
      // Fallback to mock data
      const mockArtworks = getMockArtworks();
      artwork = mockArtworks.find(a => a._id === req.params.id) || mockArtworks[0];
    }

    res.json({
      success: true,
      artwork
    });
  } catch (error) {
    console.error('Error fetching artwork:', error);
    const mockArtworks = getMockArtworks();
    res.json({
      success: true,
      artwork: mockArtworks[0]
    });
  }
});

// Create new artwork
app.post('/api/artworks', async (req, res) => {
  try {
    const { title, description, imageUrl, artistName, category, tags, isPublic, price } = req.body;

    const artworkData = {
      title,
      description,
      imageUrl: imageUrl || `https://picsum.photos/800/600?random=${Date.now()}`,
      artistName: artistName || 'Demo Artist',
      category: category || 'digital',
      tags: tags || [],
      isPublic: isPublic !== false,
      price: price || 0,
      likes: 0,
      views: 0
    };

    let artwork;

    if (mongoose.connection.readyState === 1) {
      artwork = new Artwork(artworkData);
      await artwork.save();
    } else {
      // Create mock artwork with ID
      artwork = {
        _id: Date.now().toString(),
        ...artworkData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully',
      artwork
    });
  } catch (error) {
    console.error('Error creating artwork:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create artwork'
    });
  }
});

// Like an artwork
app.post('/api/artworks/:id/like', async (req, res) => {
  try {
    let artwork;

    if (mongoose.connection.readyState === 1) {
      artwork = await Artwork.findById(req.params.id);
      if (artwork) {
        artwork.likes += 1;
        await artwork.save();
      }
    }

    if (!artwork) {
      // Fallback
      artwork = { likes: 1 };
    }

    res.json({
      success: true,
      message: 'Artwork liked successfully',
      likes: artwork.likes
    });
  } catch (error) {
    console.error('Error liking artwork:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like artwork'
    });
  }
});

// Seed initial data to MongoDB
app.post('/api/seed', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: false,
        message: 'MongoDB not connected'
      });
    }

    // Clear existing data
    await Artwork.deleteMany({});
    
    // Sample artworks data
    const sampleArtworks = getMockArtworks().map(artwork => ({
      ...artwork,
      _id: new mongoose.Types.ObjectId() // Generate new ObjectId
    }));

    const createdArtworks = await Artwork.insertMany(sampleArtworks);

    res.json({
      success: true,
      message: 'Sample data seeded successfully',
      count: createdArtworks.length
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed data'
    });
  }
});

// Mock data function
function getMockArtworks() {
  return [
    {
      _id: '1',
      title: "Digital Dreams",
      description: "A beautiful digital artwork showcasing futuristic landscapes with vibrant colors and surreal elements.",
      imageUrl: "https://picsum.photos/800/600?random=1",
      artistName: "Alex Chen",
      category: "digital",
      tags: ["digital", "future", "surreal", "landscape"],
      likes: 1200,
      views: 2500,
      isPublic: true,
      price: 299,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      title: "Cosmic Harmony",
      description: "Space themed artwork representing the balance of the universe with vibrant colors.",
      imageUrl: "https://picsum.photos/800/600?random=2",
      artistName: "Maria Rodriguez",
      category: "abstract",
      tags: ["space", "cosmic", "abstract", "universe"],
      likes: 2400,
      views: 3800,
      isPublic: true,
      price: 450,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ];
}

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🏷️  Auto-tagger: Enabled ✅`);
    console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Mock Data 🔄'}`);
  });
});