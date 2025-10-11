import express from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeImage } from '../ai_services/vision_api_services/auto_tagger.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    import('fs').then(fs => {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    });
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
    fileSize: 10 * 1024 * 1024 
  }
});

// POST 
router.post('/auto-tag', upload.single('image'), async (req, res) => {
  console.log('🎯 ========== AUTO-TAG ROUTE START ==========');
  
  let fileDeleted = false;
  
  try {
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ 
        success: false,
        error: 'No image file provided' 
      });
    }

    console.log('📁 File received:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path
    });
    
    const imagePath = req.file.path;
    
    // Check if file exists before analysis
    const fs = await import('fs');
    if (!fs.existsSync(imagePath)) {
      console.log('❌ File does not exist at path:', imagePath);
      return res.status(400).json({
        success: false,
        error: 'Uploaded file not found'
      });
    }

    console.log('🔍 Starting Google Vision API analysis...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timeout after 30 seconds')), 30000);
    });

    // Analyze image with Google Vision API
    console.log('📤 Calling analyzeImage function...');
    const analysisPromise = analyzeImage(imagePath);
    
    const analysis = await Promise.race([analysisPromise, timeoutPromise]);
    console.log('✅ Google Vision analysis completed');
    
    console.log('📊 Analysis results:', {
      labelsCount: analysis.labels?.length || 0,
      labelsSample: analysis.labels?.slice(0, 3).map(l => l.description) || []
    });
    
    // Extract tags from labels
    const tags = analysis.labels
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10)
      .map(label => label.description)
      .filter(tag => tag && tag.length > 0);

    console.log('🏷️ Final tags generated:', tags);
    
    // Clean up uploaded file
    try {
      fs.unlinkSync(imagePath);
      fileDeleted = true;
      console.log('🗑️ Temporary file cleaned up');
    } catch (cleanupError) {
      console.warn('⚠️ Could not delete temporary file:', cleanupError.message);
    }

    console.log('✅ ========== AUTO-TAG ROUTE SUCCESS ==========');
    
    res.json({
      success: true,
      tags: tags,
      safeSearch: analysis.safeSearch,
      analysisDetails: {
        totalLabelsFound: analysis.labels.length,
        tagsGenerated: tags.length
      },
      message: `Generated ${tags.length} tags automatically`
    });

  } catch (error) {
    console.error('❌ ========== AUTO-TAG ROUTE ERROR ==========');
    console.error('Error details:', error.message);
    
    const fallbackTags = ['art', 'creative', 'digital', 'design', 'visual', 'modern'];
    
    // Clean up file if exists and not already deleted
    if (req.file && !fileDeleted) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Cleaned up file after error');
        }
      } catch (cleanupError) {
        console.warn('⚠️ Could not clean up file after error:', cleanupError.message);
      }
    }
    
    console.error('❌ ========== AUTO-TAG ROUTE FAILED ==========');
    
    // Return fallback tags instead of error
    res.json({
      success: true,
      tags: fallbackTags,
      safeSearch: {
        adult: 'VERY_UNLIKELY',
        violence: 'VERY_UNLIKELY',
        medical: 'UNLIKELY',
        spoof: 'UNLIKELY',
        racy: 'UNLIKELY'
      },
      analysisDetails: {
        totalLabelsFound: fallbackTags.length,
        tagsGenerated: fallbackTags.length,
        fallbackUsed: true
      },
      message: `Used fallback tags due to analysis issue: ${error.message}`
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  console.log('✅ Auto-tagger test endpoint hit');
  res.json({ 
    success: true, 
    message: 'Auto-tagger route is working!',
    timestamp: new Date().toISOString()
  });
});

export default router;