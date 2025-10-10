import API from "../utils/api";

export const savedService = {
  // Get all saved items for a user
  getSavedItems: (userId) => {
    return API.get(`/saved/${userId}`);
  },

  // Save an artwork
  saveArtwork: (artworkId, userId) => {
    return API.post(`/saved/artworks/${artworkId}`, { userId });
  },

  // Unsave an artwork
  unsaveArtwork: (artworkId, userId) => {
    return API.delete(`/saved/artworks/${artworkId}`, { data: { userId } });
  },

  // Check if artwork is saved
  checkArtworkSaved: (artworkId, userId) => {
    return API.get(`/saved/artworks/${artworkId}/status?userId=${userId}`);
  },

  // Save a collection
  saveCollection: (collectionId, userId) => {
    return API.post(`/saved/collections/${collectionId}`, { userId });
  },

  // Unsave a collection
  unsaveCollection: (collectionId, userId) => {
    return API.delete(`/saved/collections/${collectionId}`, { data: { userId } });
  },

  // Check if collection is saved
  checkCollectionSaved: (collectionId, userId) => {
    return API.get(`/saved/collections/${collectionId}/status?userId=${userId}`);
  }
};