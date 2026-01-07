import axiosInstance from './axiosConfig';

// Get achievements for the current user
export const getCurrentUserAchievements = async (userId) => {
  try {
    console.log('Fetching achievements for user:', userId);
    
    // If userId is not provided, try to get it from localStorage
    if (!userId) {
      console.log('No userId provided, checking localStorage...');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userId = user.id;
        console.log('Found userId in localStorage:', userId);
      }
    }

    if (!userId) {
      throw new Error('User ID is required to fetch achievements');
    }

    const response = await axiosInstance.get(`/achievements/user/${userId}`);
    console.log('Achievements response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', {
      error,
      userId,
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

// Get achievements for a specific user
export const getUserAchievements = async (userId) => {
  try {
    const response = await axiosInstance.get(`/achievements/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
};

// Get achievement stats for the current user
export const getUserAchievementStats = async (userId) => {
  try {
    console.log('Fetching achievement stats for user:', userId);
    
    // If userId is not provided, try to get it from localStorage
    if (!userId) {
      console.log('No userId provided, checking localStorage...');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userId = user.id;
        console.log('Found userId in localStorage:', userId);
      }
    }

    if (!userId) {
      throw new Error('User ID is required to fetch achievement stats');
    }

    const response = await axiosInstance.get(`/achievements/user/${userId}/stats`);
    console.log('Achievement stats response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching achievement stats:', {
      error,
      userId,
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

// Get all available badges
export const getAllBadges = async () => {
  try {
    const response = await axiosInstance.get('/badges');
    return response.data;
  } catch (error) {
    console.error('Error fetching badges:', error);
    
    // Fallback to mock data if the endpoint isn't available yet
    console.warn('Using mock badges data');
    const mockBadges = [
      { id: 1, name: 'SPEED_STAR', type: 'gold', description: 'Complete tasks before deadline' },
      { id: 2, name: 'EFFICIENCY_MASTER', type: 'silver', description: 'Complete 5 tasks in a week' },
      { id: 3, name: 'CONSISTENCY_CHAMPION', type: 'bronze', description: 'Maintain a 5-day streak' }
    ];
    
    return mockBadges;
  }
};