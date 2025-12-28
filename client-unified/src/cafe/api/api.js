import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance for Cafe Owner routes
const apiClient = axios.create({
  baseURL: `${BASE_URL}/cafe-owner`, // Points to /api/cafe-owner
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cafe_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Prevent toast duplication or specific error handling if needed
    const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
    // We only show toast here if it's a generic error, otherwise specific pages might handle it
    // toast.error(errorMessage); 
    return Promise.reject(error);
  }
);

// --- API Service Functions ---

// Analytics
export const getDashboardAnalytics = () => apiClient.get('/analytics/summary');
export const getLoyaltyMetrics = () => apiClient.get('/analytics/loyalty');
export const getActivityLog = (timeFilter) => {
  return apiClient.get('/activity-log', { params: { filter: timeFilter } });
};

// Events (Note: This points to /api/events, not /api/cafe-owner/events)
export const getActiveEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/events/active`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch events.';
    toast.error(errorMessage);
    throw error;
  }
};

// Profile & Images
export const getCafeProfile = () => apiClient.get('/profile');
export const updateCafeProfile = (profileData) => apiClient.put('/profile', profileData);
export const addCafeImage = (imageData) => apiClient.post('/images/add', { image: imageData });
export const deleteCafeImage = (public_id) => apiClient.post('/images/delete', { public_id });

// Offers
export const getOffers = () => apiClient.get('/offers');
export const addOffer = (offerData) => apiClient.post('/offers', offerData);
export const deleteOffer = (offerId) => apiClient.delete(`/offers/${offerId}`);

// Customers
export const getCustomerPoints = (customerPhone) => {
  return apiClient.post('/customer-points', { customerPhone });
};

// Redemption
export const initiateRedemption = (customerPhone, pointsToRedeem) => {
  return apiClient.post('/redemption/initiate', { customerPhone, pointsToRedeem });
};

export const verifyRedemption = (otp, customerEmail) => {
  return apiClient.post('/redemption/verify', { otp, customerEmail });
};

// Public Data (Fetches all cafes)
export const getAllCafes = () => axios.get(`${BASE_URL}/cafes`);

// Contact
export const submitContactForm = (data) => apiClient.post('/contact-us', data);

// Auth Export (Used for Login/Register)
export const loginCafe = (credentials) => apiClient.post('/login', credentials);
export const registerCafeRequest = (data) => apiClient.post('/register/request-otp', data);
export const verifyRegisterOtp = (data) => apiClient.post('/register/verify-otp', data);
export const resendRegisterOtp = (data) => apiClient.post('/register/resend-otp', data);

// Password Reset Export
export const requestPasswordReset = (data) => apiClient.post('/password/request-reset', data);
export const verifyPasswordOtp = (data) => apiClient.post('/password/verify-otp', data);
export const resetPassword = (data) => apiClient.post('/password/reset', data);

export default apiClient;