import axios from "axios";
import { API_BASE_URL } from "../config";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const rewardsApi = {
  getAllRewards: async () => {
    try {
      console.log("Calling getAllRewards endpoint...");
      console.log("API URL:", `${API_BASE_URL}/rewards`);
      console.log("Auth headers:", getAuthHeader());

      const response = await axios.get(`${API_BASE_URL}/rewards`, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      console.log("Get all rewards response:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching all rewards:", error.response || error);
      console.error("Detailed error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
      });
      // Return empty array instead of throwing error
      return [];
    }
  },

  getAvailableRewards: async () => {
    try {
      console.log("Calling getAvailableRewards endpoint...");
      console.log("API URL:", `${API_BASE_URL}/rewards/available`);
      console.log("Auth headers:", getAuthHeader());

      const response = await axios.get(`${API_BASE_URL}/rewards/available`, {
        headers: getAuthHeader(),
      });

      console.log("Response received:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching available rewards:",
        error.response || error
      );
      console.error("Detailed error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
      });
      throw error;
    }
  },

  getRewardById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rewards/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching reward by id:", error.response || error);
      throw error;
    }
  },

  createReward: async (rewardData) => {
    try {
      console.log("Creating reward with data:", rewardData);
      console.log("Auth headers:", getAuthHeader());
      console.log("API URL:", `${API_BASE_URL}/rewards`);

      const response = await axios.post(`${API_BASE_URL}/rewards`, rewardData, {
        headers: getAuthHeader(),
      });

      console.log("Create reward response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating reward:", error.response || error);
      console.error("Detailed error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
      });
      throw error;
    }
  },

  updateReward: async (id, rewardData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/rewards/${id}`,
        rewardData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating reward:", error.response || error);
      throw error;
    }
  },

  deleteReward: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/rewards/${id}`, {
        headers: getAuthHeader(),
      });
    } catch (error) {
      console.error("Error deleting reward:", error.response || error);
      throw error;
    }
  },

  purchaseReward: async (rewardId, userId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/rewards/${rewardId}/purchase?userId=${userId}`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error purchasing reward:", error.response || error);
      throw error;
    }
  },
};

export default rewardsApi;
