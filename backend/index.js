import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import uploadRoutes from './routes/upload.js';

// Import models
import User from './models/User.js';
import Artwork from './models/Artwork.js';

// Import routes
import userRoutes from './routes/users.js';
import artworkRoutes from './routes/artworks.js';

// Import auto-tagger
import { analyzeImage } from './ai_services/vision_api_services/auto_tagger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// use upload routes

app.use('/api/upload', uploadRoutes);

// Clerk middleware for webhooks (exclude from auth)
app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }));

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
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('❌ No MongoDB URI found');
    }
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// ==================== ROUTES ====================

// Use imported routes
app.use('/api/users', userRoutes);
app.use('/api/artworks', artworkRoutes);

// ==================== CLERK WEBHOOKS ====================

// Clerk webhook for user synchronization
app.post('/api/webhooks/clerk', async (req, res) => {
  try {
    // Note: In production, you should verify the webhook signature
    // For now, we'll process without verification for development
    
    const { type, data } = req.body;
    
    console.log(`🔄 Clerk Webhook Received: ${type}`);

    switch (type) {
      case 'user.created':
        await User.findOrCreateFromClerk(data);
        console.log(`✅ User created: ${data.id}`);
        break;
        
      case 'user.updated':
        await User.findOneAndUpdate(
          { clerkUserId: data.id },
          {
            email: data.email_addresses[0]?.email_address,
            username: data.username,
            firstName: data.first_name,
            lastName: data.last_name,
            profileImage: data.profile_image_url,
            'clerkData.lastSignInAt': data.last_sign_in_at,
            updatedAt: new Date()
          }
        );
        console.log(`✅ User updated: ${data.id}`);
        break;
        
      case 'user.deleted':
        await User.findOneAndDelete({ clerkUserId: data.id });
        console.log(`✅ User deleted: ${data.id}`);
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Clerk webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

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

    const { 
      title, 
      description, 
      category, 
      price, 
      customTags,
      clerkUserId 
    } = req.body;
    
    if (!clerkUserId) {
      return res.status(400).json({ 
        success: false,
        error: 'clerkUserId is required' 
      });
    }

    console.log('🔄 Uploading artwork with auto-tags...');
    
    // Find user
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
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
      cloudinaryId: `local_${req.file.filename}`,
      category: category || 'digital',
      tags: allTags,
      price: price ? parseFloat(price) : 0,
      userId: user._id,
      clerkUserId: user.clerkUserId,
      artistName: user.fullName || user.username,
      isPublic: true,
      dimensions: { width: 1920, height: 1080, unit: 'px' },
      fileFormat: "JPEG",
      resolution: { width: 1920, height: 1080 }
    };

    // Step 4: Save to database
    const artwork = new Artwork(artworkData);
    const savedArtwork = await artwork.save();

    // Populate user info
    await savedArtwork.populate('userId', 'username firstName lastName profileImage');

    console.log('✅ Artwork uploaded with tags:', allTags);

    res.status(201).json({
      success: true,
      message: 'Artwork uploaded successfully with auto-generated tags!',
      artwork: savedArtwork,
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

// ==================== BASIC ROUTES ====================

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Grand Gallery API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    features: ['clerk-auth', 'auto-tagging', 'artwork-management', 'user-profiles']
  });
});

// Protected test route
app.get('/api/protected', ClerkExpressRequireAuth(), (req, res) => {
  res.json({ 
    message: 'This is a protected route!',
    user: req.auth
  });
});

// Get current user profile
app.get('/api/me', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.toPublicJSON ? user.toPublicJSON() : user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global Error Handler:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// ==================== SERVER START ====================

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
🚀 Grand Gallery Server Started!
📡 Port: ${PORT}
🔗 API: http://localhost:${PORT}/api
🏷️  Auto-tagger: Enabled ✅
🔐 Clerk Auth: Integrated ✅
🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
    `);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});