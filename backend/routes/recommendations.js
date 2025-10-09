// routes/recommendations.js
import express from 'express';
import { getRecommendations } from '../ai_services/recommendation_service.js';

const router = express.Router();

// GET /api/recommendations/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔄 Fetching recommendations for user:', userId);
    
    const recommendations = await getRecommendations(userId);
    
    res.json({
      success: true,
      recommendations: recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations',
      message: error.message
    });
  }
});

export default router;