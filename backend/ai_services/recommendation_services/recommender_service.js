
import mongoose from 'mongoose';

import Artwork from '../../models/Artwork.js'; 
import User from '../../models/User.js'; 

const TAG_LIMIT = 5;    
const REC_LIMIT = 12;   

/**
 * * @param {Array<Object>} artworkList - List of artwork objects (populated from User/Activity).
 * @returns {Array<string>} The top 'TAG_LIMIT' tags.
 */
function getTopTags(artworkList) {
    const allTags = artworkList.flatMap(artwork => artwork.tags || []);
    
    let tagCounts = {};
    allTags.forEach(tag => {
        tag = tag.toLowerCase().trim();
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const topTags = Object.entries(tagCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, TAG_LIMIT)
        .map(([tag]) => tag);

    return topTags;
}

/**
 * Generates personalized recommendations based on the user's expressed interests (tags).
 * * @param {string} userId - The ID of the user requesting recommendations.
 * @returns {Promise<Array<Object>>} - A list of recommended artworks.
 */
export async function generateRecommendations(userId) {
    const user = await User.findById(userId).select('username'); 
    if (!user) return [];
    
    const userLikedArtworks = await Artwork.find({
        likes: { $gt: 5 } 
    })
    .limit(30) 
    .select('tags category');
    
    const topTags = getTopTags(userLikedArtworks); 
    
    if (topTags.length === 0) {
        return Artwork.find().sort({ likes: -1, views: -1 }).limit(REC_LIMIT);
    }
    const excludedIds = userLikedArtworks.map(a => a._id);

    const recommendations = await Artwork.find({
        tags: { $in: topTags }, 
                artistId: { $ne: userId },
        
        _id: { $nin: excludedIds }
    })
    .limit(REC_LIMIT) 
    .sort({ views: -1, likes: -1, createdAt: -1 }) 
    .select('title artistName imageUrl tags likes views');

    return recommendations;
}

// NOTE: You would need to export this function and use it in an Express route.