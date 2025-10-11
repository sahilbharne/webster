
import API from '../utils/api.js';

export const collectionService = {
  // Get all public collections
  getAll: async (params = {}) => {
    try {
      const response = await API.get('/collections', { params });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Collection service error (getAll):', error);
      throw error;
    }
  },

  // Get user's collections
  getUserCollections: async (clerkUserId) => {
    try {
      const response = await API.get(`/collections/user/${clerkUserId}`);
      return response.data;
    } catch (error) {
      console.error('Collection service error (getUserCollections):', error);
      throw error;
    }
  },

  // Get single collection
  getById: async (id, clerkUserId = null) => {
  try {
    const params = {};
    if (clerkUserId) {
      params.clerkUserId = clerkUserId;
    }
    
    const response = await API.get(`/collections/${id}`, { params });
    return response.data;
  } catch (error) {
    console.error('Collection service error (getById):', error);
    throw error;
  }
},

  // Create collection
  create: async (collectionData) => {
    try {
      const response = await API.post('/collections', collectionData);
      return response.data;
    } catch (error) {
      console.error('Collection service error (create):', error);
      throw error;
    }
  },

  // Update collection
  update: async (id, updates) => {
    try {
      const response = await API.put(`/collections/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Collection service error (update):', error);
      throw error;
    }
  },

  // Delete collection
  delete: async (id, clerkUserId) => {
    try {
      const response = await API.delete(`/collections/${id}`, {
        data: { clerkUserId }
      });
      return response.data;
    } catch (error) {
      console.error('Collection service error (delete):', error);
      throw error;
    }
  },

  getAvailableArtworks: async (collectionId, clerkUserId) => {
    try {
      const response = await API.get(`/collections/${collectionId}/available-artworks`, {
        params: { clerkUserId }
      });
      return response.data;
    } catch (error) {
      console.error('Collection service error (getAvailableArtworks):', error);
      throw error;
    }
  },

  // Add artwork to collection
  addArtwork: async (collectionId, artworkId, clerkUserId) => {
    try {
      const response = await API.post(`/collections/${collectionId}/artworks`, {
        artworkId,
        clerkUserId
      });
      return response.data;
    } catch (error) {
      console.error('Collection service error (addArtwork):', error);
      throw error;
    }
  },

  // Remove artwork from collection
  removeArtwork: async (collectionId, artworkId, clerkUserId) => {
    try {
      const response = await API.delete(`/collections/${collectionId}/artworks/${artworkId}`, {
        data: { clerkUserId }
      });
      return response.data;
    } catch (error) {
      console.error('Collection service error (removeArtwork):', error);
      throw error;
    }
  }
};