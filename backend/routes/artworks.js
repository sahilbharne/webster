const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');

// GET all artworks
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 });
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

// ADD SAMPLE ARTWORKS - This must come BEFORE the :id route
router.post('/sample', async (req, res) => {
  try {
    console.log('🔄 Adding sample artworks to database...');
    
    const sampleArtworks = [
      {
        title: "Sunset Mountains",
        artist: "Nature Lover",
        description: "A beautiful painting of mountains during sunset with vibrant colors painting the sky",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 15,
        tags: ["nature", "mountains", "sunset", "landscape"]
      },
      {
        title: "Abstract Dreams",
        artist: "Modern Artist",
        description: "Colorful abstract artwork representing dreams and imagination",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 23,
        tags: ["abstract", "colorful", "modern", "dreams"]
      },
      {
        title: "Ocean Waves",
        artist: "Sea Artist", 
        description: "Powerful ocean waves crashing against rocky cliffs at golden hour",
        imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 8,
        tags: ["ocean", "waves", "nature", "water"]
      }
    ];

    // Insert sample data
    const createdArtworks = await Artwork.insertMany(sampleArtworks);
    
    console.log(`✅ Added ${createdArtworks.length} sample artworks to database`);
    
    res.json({ 
      message: 'Sample artworks added successfully!', 
      count: createdArtworks.length,
      artworks: createdArtworks 
    });
  } catch (error) {
    console.error('❌ Error adding sample artworks:', error);
    res.status(500).json({ error: 'Failed to add sample artworks' });
  }
});

// GET single artwork by ID - This must come AFTER specific routes
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    res.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({ error: 'Failed to fetch artwork' });
  }
});

// Other routes (update, delete) go here...

module.exports = router;