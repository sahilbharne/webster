// src/services/likeService.js
import API from '../utils/api.js';

export const likeService = {
  // Like or unlike an artwork
  toggleLike: async (artworkId, clerkUserId) => {
    try {
      console.log('🔄 Toggling like for artwork:', artworkId, 'user:', clerkUserId);
      
      const response = await API.post(`/artworks/${artworkId}/like`, {
        clerkUserId
      });
      
      console.log('✅ Like toggle successful:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Like service error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to update like');
    }
  },

  // Check if user has liked an artwork
  getLikeStatus: async (artworkId, clerkUserId) => {
    try {
      console.log('🔍 Getting like status for artwork:', artworkId, 'user:', clerkUserId);
      
      const response = await API.get(`/artworks/${artworkId}/like-status/${clerkUserId}`);
      
      console.log('✅ Like status:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Like status service error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to check like status');
    }
  }
};