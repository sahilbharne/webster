import Artwork from '../models/Artwork.js'; // Adjust the path to your artwork model
import User from '../models/User.js';       // Adjust the path to your user model

export const getRecommendations = async (clerkUserId) => {
    const likedArtworks = await Artwork.find({ likes: clerkUserId }).lean();

    if (likedArtworks.length === 0) {
        return Artwork.find({ isPublic: true, status: 'published' })
            .sort({ likes: -1, views: -1 })
            .limit(20)
            .lean();
    }

    const likedArtworkIds = likedArtworks.map(art => art._id.toString());

    const userProfile = {
        tags: new Set(),
        categories: new Set(),
        artists: new Set()
    };

    likedArtworks.forEach(art => {
        art.tags.forEach(tag => userProfile.tags.add(tag));
        userProfile.categories.add(art.category);
        userProfile.artists.add(art.clerkUserId); 
    });

    const similarUsers = await Artwork.distinct('likes', {
        _id: { $in: likedArtworkIds },
        likes: { $ne: clerkUserId } 
    });

    const potentialArtworks = await Artwork.find({
        $and: [
            { _id: { $nin: likedArtworkIds } }, 
            { isPublic: true, status: 'published' }
        ],
        $or: [
            { tags: { $in: Array.from(userProfile.tags) } },
            { category: { $in: Array.from(userProfile.categories) } },
            { likes: { $in: similarUsers } }
        ]
    }).limit(200).lean(); 

    const scoredArtworks = potentialArtworks.map(art => {
        let score = 0;

        art.tags.forEach(tag => {
            if (userProfile.tags.has(tag)) score += 2; // High score for matching tags
        });
        if (userProfile.categories.has(art.category)) score += 3; 
        if (userProfile.artists.has(art.clerkUserId)) score += 1; 

        const similarLikers = art.likes.filter(likerId => similarUsers.includes(likerId));
        score += similarLikers.length * 1.5; 

        return { ...art, score };
    });

    scoredArtworks.sort((a, b) => b.score - a.score);

    return scoredArtworks.slice(0, 20); // Return the top 20 recommendations
};