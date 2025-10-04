// // src/services/viewService.js
// import API from '../utils/api.js';

// export const viewService = {
//   // Record a view for an artwork
//   recordView: async (artworkId, clerkUserId = null) => {
//     try {
//       console.log('👁️ Recording view for artwork:', artworkId);
      
//       const response = await API.post(`/artworks/${artworkId}/view`, {
//         clerkUserId
//       });
      
//       console.log('✅ View recorded successfully:', response.data);
//       return response.data;
      
//     } catch (error) {
//       console.error('❌ View service error:', error);
//       // Don't throw error for views - it shouldn't break the user experience
//       return { success: false, views: 0 };
//     }
//   },

//   // Get artwork views (optional)
//   getViews: async (artworkId) => {
//     try {
//       const response = await API.get(`/artworks/${artworkId}`);
//       return {
//         success: true,
//         views: response.data.views || 0
//       };
//     } catch (error) {
//       console.error('❌ Get views error:', error);
//       return { success: false, views: 0 };
//     }
//   }
// };


// src/services/viewService.js
import API from '../utils/api.js';

export const viewService = {
  // Record a view for an artwork
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
      // Don't throw error for views - it shouldn't break the user experience
      return { success: false, views: 0 };
    }
  }
};