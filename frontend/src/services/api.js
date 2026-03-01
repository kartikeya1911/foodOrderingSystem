import axiosInstance from './axios';

export const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const restaurantService = {
  getAllRestaurants: async () => {
    const response = await axiosInstance.get('/restaurants/active');
    return response.data;
  },

  getRestaurantById: async (id) => {
    const response = await axiosInstance.get(`/restaurants/${id}`);
    return response.data;
  },

  getFoodItems: async (restaurantId) => {
    const response = await axiosInstance.get(`/restaurants/${restaurantId}/food-items`);
    return response.data;
  },

  // Owner-specific endpoints
  getMyRestaurants: async () => {
    const response = await axiosInstance.get('/restaurants/my-restaurants');
    return response.data;
  },

  createRestaurant: async (restaurantData) => {
    const response = await axiosInstance.post('/restaurants', restaurantData);
    return response.data;
  },

  updateRestaurant: async (id, restaurantData) => {
    const response = await axiosInstance.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },

  deleteRestaurant: async (id) => {
    await axiosInstance.delete(`/restaurants/${id}`);
  },

  // Food item management for owners
  addFoodItem: async (restaurantId, foodItemData) => {
    const response = await axiosInstance.post(`/restaurants/${restaurantId}/food-items`, foodItemData);
    return response.data;
  },

  updateFoodItem: async (foodItemId, foodItemData) => {
    const response = await axiosInstance.put(`/restaurants/food-items/${foodItemId}`, foodItemData);
    return response.data;
  },

  deleteFoodItem: async (foodItemId) => {
    await axiosInstance.delete(`/restaurants/food-items/${foodItemId}`);
  },
};

export const orderService = {
  addToCart: async (item) => {
    const response = await axiosInstance.post('/orders/cart', item);
    return response.data;
  },

  getCart: async () => {
    const response = await axiosInstance.get('/orders/cart');
    return response.data;
  },

  removeFromCart: async (foodItemId) => {
    await axiosInstance.delete(`/orders/cart/items/${foodItemId}`);
  },

  clearCart: async () => {
    await axiosInstance.delete('/orders/cart');
  },

  placeOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await axiosInstance.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  // Owner-specific endpoints
  getRestaurantOrders: async (restaurantId) => {
    const response = await axiosInstance.get(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axiosInstance.put(`/orders/${orderId}/status?status=${status}`);
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/users/profile', profileData);
    return response.data;
  },
};
