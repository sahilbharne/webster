import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Artwork from '../models/Artwork.js';
import { clerkClient } from '@clerk/express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload artwork
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, tags, isPublic } = req.body;
    const user = req.auth; // From Clerk middleware

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'grand-gallery',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'webp' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Create artwork in database
    const artwork = new Artwork({
      title,
      description,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      artist: user.id, 
      artistName: `${user.firstName} ${user.lastName}`,
      artistClerkId: user.userId,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category,
      isPublic: isPublic === 'true'
    });

    await artwork.save();

    res.status(201).json({
      message: 'Artwork uploaded successfully',
      artwork
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload artwork' });
  }
});

// Upload artwork with auto tag generation

router.post('/with-tags', upload.single('image'), async (req, res) => {
  try {
    console.log('📥 Received upload request');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? `File: ${req.file.originalname}, Size: ${req.file.size} bytes` : 'No file');

    const { title, description, category, customTags, clerkUserId } = req.body;

    if (!clerkUserId) {
      return res.status(400).json({ 
        success: false,
        error: 'clerkUserId is required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image file provided' 
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Title is required' 
      });
    }

    // Find user by Clerk ID
    const User = mongoose.model('User');
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found. Please sync user first.' 
      });
    }

    console.log('☁️ Uploading to Cloudinary...');

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'grand-gallery',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'webp' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result.secure_url);
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    // Parse tags
    let tags = [];
    if (customTags) {
      tags = customTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    console.log('🏷️ Tags to be saved:', tags);

    // Create artwork in database
    const Artwork = mongoose.model('Artwork');
    const artworkData = {
      title: title.trim(),
      description: description?.trim() || '',
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      userId: user._id,
      clerkUserId,
      artistName: user.fullName || user.username,
      tags,
      category: category || 'digital',
      isPublic: true,
      price: 0,
      fileFormat: req.file.mimetype.split('/')[1].toUpperCase(),
      fileSize: req.file.size,
      status: 'published'
    };

    console.log('💾 Creating artwork in database...');
    const artwork = new Artwork(artworkData);
    await artwork.save();

    // Populate user info
    await artwork.populate('userId', 'username firstName lastName profileImage');

    console.log('✅ Artwork created successfully:', artwork._id);

    res.status(201).json({
      success: true,
      message: 'Artwork uploaded successfully',
      artwork
    });

  } catch (error) {
    console.error('❌ Upload with tags error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload artwork',
      details: error.message 
    });
  }
});

export default router;