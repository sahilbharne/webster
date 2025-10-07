// services/followService.js
import API from "../utils/api";

export const followService = {
  // Follow an artist
  followArtist: (artistId, followerId) => {
    return API.post(`/follow/${artistId}`, { followerId });
  },

  // Unfollow an artist
  unfollowArtist: (artistId, followerId) => {
    return API.delete(`/follow/${artistId}`, { data: { followerId } });
  },

  // Check if user is following an artist
  checkFollowStatus: (artistId, followerId) => {
    return API.get(`/follow/status/${artistId}/${followerId}`);
  },

  // Get all artists the user is following
  getFollowing: (userId) => {
    return API.get(`/follow/following/${userId}`);
  },

  // Get user's followers
  getFollowers: (userId) => {
    return API.get(`/follow/followers/${userId}`);
  }
};