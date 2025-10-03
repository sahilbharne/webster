import express from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeImage } from '../ai_services/vision_api_services/auto_tagger.js';

const router = express.Router();

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

// POST /api/auto-tag
router.post('/auto-tag', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Processing image:', req.file.filename);
    
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
    const fs = await import('fs');
    fs.unlinkSync(imagePath);

    console.log('Generated tags:', tags);

    res.json({
      success: true,
      tags: tags,
      safeSearch: safeSearch,
      message: `Generated ${tags.length} tags automatically`
    });

  } catch (error) {
    console.error('Auto-tag error:', error);
    
    // Clean up file if exists
    if (req.file) {
      const fs = await import('fs');
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
});

export default router;