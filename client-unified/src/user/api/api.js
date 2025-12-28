import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = async (endpoint, data = {}, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios({
      method: options.method || 'GET',
      url: `${API_URL}${endpoint}`, // ✅ Uses the Env Variable
      data: options.method === 'POST' || options.method === 'PUT' ? data : null,
      headers,
      withCredentials: options.withCredentials || false,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'API request failed';
    console.error(`API Error on ${endpoint}:`, errorMessage);
    throw errorMessage;
  }
};

// --- Auth Functions ---
export const loginUser = (phone, password) => apiClient('/users/login', { phone, password }, { method: 'POST' });
export const registerUser = (data) => apiClient('/users/register', data, { method: 'POST' });
export const requestEmailOtp = (data) => apiClient('/email-otp/request-email-otp', data, { method: 'POST' });
export const verifyEmailOtp = (data) => apiClient('/email-otp/verify-email-otp', data, { method: 'POST' });
export const resendEmailOtp = (data) => apiClient('/email-otp/resend-email-otp', data, { method: 'POST' });
export const logoutUser = () => apiClient('/users/logout', {}, { method: 'POST' });

// --- Profile Functions (The missing ones causing your error) ---
export const getProfile = (phone) => apiClient(`/users/profile/${phone}`, {}, { method: 'GET' });
export const updateProfile = (phone, data) => apiClient(`/users/profile/${phone}`, data, { method: 'PUT' });
export const changePassword = (phone, body) => apiClient(`/users/profile/${phone}/change-password`, body, { method: 'PUT' });

// --- Leaderboard & Rewards ---
export const getLeaderboard = () => apiClient('/users/leaderboard', {}, { method: 'GET' });
export const getRewardsHistory = (phone) => apiClient(`/users/rewards/${phone}`, {}, { method: 'GET' });

// --- Cafes ---
export const getCafes = () => apiClient('/cafes', {}, { method: 'GET' });
export const getCafeById = (id) => apiClient(`/cafes/${id}`, {}, { method: 'GET' });
export const getOffersByCafeId = (id) => apiClient(`/cafes/${id}/offers`, {}, { method: 'GET' });

// --- Reward Claiming ---
export const getRewardCafes = () => apiClient("/rewards/cafes", {}, { method: "GET", withCredentials: true });

export const claimReward = (formData) =>
  apiClient("/rewards/claim", formData, {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
});

// --- Events ---
export const getActiveEvents = async () => {
  try {
    // Uses the same API_URL variable
    const response = await fetch(`${API_URL}/events/active`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch active events:', error);
    throw error;
  }
};

export const getAnnouncements = () => apiClient('/users/announcements', {}, { method: 'GET' });

// --- Points & Invoices ---
export const getUserCafePoints = (phone) => apiClient(`/users/cafe-points/${phone}`, {}, { method: "GET" });
export const getInvoiceHistory = () => apiClient("/rewards/invoice-history", {}, { method: "GET", withCredentials: true });

// --- Contact ---
export const submitContactForm = (data) => apiClient('/users/contact-us', data, { method: 'POST' });

// --- Forgot Password Flow ---
export const sendForgotPasswordOTP = (mobile) => 
  apiClient("/forgot-password/send-otp", { mobile }, { method: "POST" });

export const verifyForgotPasswordOTP = (mobile, otp) => 
  apiClient("/forgot-password/verify-otp", { mobile, otp }, { method: "POST" });

export const resetUserPassword = (mobile, password) => 
  apiClient("/forgot-password/reset-password", { mobile, password }, { method: "POST" });

export default apiClient;