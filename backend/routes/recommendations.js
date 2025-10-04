
import express from 'express';
import { generateRecommendations } from '../ai_services/recommendation_services/recommender_service.js';

const router = express.Router();

router.get('/:userId/recommendations', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const recommendations = await generateRecommendations(userId);

        res.status(200).json({
            status: 'success',
            results: recommendations.length,
            data: {
                recommendations,
            },
        });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to generate recommendations.',
            details: error.message
        });
    }
});

export default router;