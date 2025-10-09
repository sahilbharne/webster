
import API from "../utils/api";

export const recommendationService = {
  getRecommendations: (clerkUserId) => {
    return API.get(`/recommendations/${clerkUserId}`);
  },
};