import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Artwork from '../models/Artwork.js';
import { clerkClient } from '@clerk/express';

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
      artist: user.id, // MongoDB user ID
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

export default router;