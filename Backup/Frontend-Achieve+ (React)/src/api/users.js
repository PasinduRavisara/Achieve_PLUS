import axiosInstance from "./axiosConfig";

export const getAllUsers = async () => {
  try {
    console.log("Fetching all users...");
    const response = await axiosInstance.get("/user");
    console.log("All users response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getEmployees = async () => {
  try {
    console.log("Starting to fetch employees...");

    // Use the getAllUsers endpoint instead
    const response = await axiosInstance.get("/user"); 
    console.log("Raw users response:", response);

    if (!response.data) {
      console.error("No data received from server");
      throw new Error("No data received from server");
    }

    // Filter and map the response to get only employees
    const employees = Array.isArray(response.data)
      ? response.data
          .filter((user) => user.role === "ROLE_EMPLOYEE")
          .map((user) => ({
            id: user.id,
            name: user.fullName,
            email: user.email,
          }))
      : [];

    console.log("Filtered employees:", employees);

    if (employees.length === 0) {
      console.warn("No employees found in the response");
    }

    return employees;
  } catch (error) {
    console.error("Error in getEmployees:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error("Not authorized to view users");
      } else if (error.response.status === 401) {
        throw new Error("Please log in again");
      }
      // If there's an error message from the server, use it
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }

    // Default error message
    throw new Error("Failed to load employees. Please try again.");
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/user", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axiosInstance.delete(`/user/${userId}`);
    return true;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getLeaderboardUsers = async () => {
  try {
    console.log("Fetching leaderboard users...");
    const response = await axiosInstance.get("/user/leaderboard");
    console.log("Leaderboard users response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard users:", error);
    throw error.response ? error.response.data : error.message;
  }
};
