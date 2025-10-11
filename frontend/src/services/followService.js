
import API from "../utils/api";

export const followService = {
  followArtist: (artistId, followerId) => {
    return API.post(`/follow/${artistId}`, { followerId });
  },

  unfollowArtist: (artistId, followerId) => {
    return API.delete(`/follow/${artistId}`, { data: { followerId } });
  },

  getFollowing: (userId) => {
    return API.get(`/follow/following/${userId}`);
  },

  getFollowers: (userId) => {
    return API.get(`/follow/followers/${userId}`);
  },

  checkFollowStatus: (artistId, followerId) => {
    return API.get(`/follow/status/${artistId}/${followerId}`);
  },
};