
import API from '../utils/api.js';

export const viewService = {
  
  recordView: async (artworkId, clerkUserId = null) => {
    try {
      console.log('👁️ Recording view for artwork:', artworkId);
      
      const response = await API.post(`/artworks/${artworkId}/view`, {
        clerkUserId
      });
      
      console.log('✅ View recorded successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ View service error:', error);
      
      return { success: false, views: 0 };
    }
  }
};