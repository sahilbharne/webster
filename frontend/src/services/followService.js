// services/followService.js
import API from "../utils/api";

export const followService = {
  // ✅ FIXED: POST to /api/follow/:artistId
  followArtist: (artistId, followerId) => {
    return API.post(`/follow/${artistId}`, { followerId });
  },

  // ✅ FIXED: DELETE to /api/follow/:artistId
  unfollowArtist: (artistId, followerId) => {
    return API.delete(`/follow/${artistId}`, { data: { followerId } });
  },

  // ✅ FIXED: GET to /api/follow/status/:artistId/:followerId
  checkFollowStatus: (artistId, followerId) => {
    return API.get(`/follow/status/${artistId}/${followerId}`);
  },

  getFollowing: (userId) => {
    return API.get(`/follow/following/${userId}`);
  },

  getFollowers: (userId) => {
    return API.get(`/follow/followers/${userId}`);
  },
};