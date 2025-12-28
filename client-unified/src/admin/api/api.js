// src/admin/api/api.js

import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const adminApiClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`, 
});

// Interceptor to add the auth token
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminGetDashboardStats = async () => {
  try {
    const { data } = await adminApiClient.get('/stats');
    return data;
  } catch (error) {
    console.error("Stats Fetch Error:", error);
    // Return zeros on error to prevent UI crash
    return { totalUsers: 0, totalCafes: 0, pendingCafes: 0, recentRedemptions: 0 };
  }
};

export const checkAdminExists = async () => {
  try {
    const { data } = await adminApiClient.get('/exists');
    return data.exists;
  } catch (error) {
    toast.error('Could not verify admin status.');
    return true; 
  }
};

export const registerAdmin = async (adminData) => {
  try {
    const { data } = await adminApiClient.post('/register', adminData);
    toast.success('Admin registered successfully!');
    return data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Registration failed.');
    throw error;
  }
};

export const loginAdmin = async (credentials) => {
  try {
    const { data } = await adminApiClient.post('/login', credentials);
    localStorage.setItem('admin_token', data.token);
    toast.success('Login successful!');
    return data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Login failed.');
    throw error;
  }
};

export const adminGetAllUsers = async () => {
  const { data } = await adminApiClient.get('/users/all');
  return data;
};

export const adminGetUserById = async (userId) => {
  try {
    const { data } = await adminApiClient.get(`/users/${userId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const adminGetPendingCafes = async () => {
  const { data } = await adminApiClient.get('/cafes/pending');
  return data;
};

export const adminGetAllCafes = async () => {
  const { data } = await adminApiClient.get('/cafes/all');
  return data;
};

export const adminGetCafesList = async () => {
  try {
      const response = await adminApiClient.get('/cafes/all');
      return response.data;
  } catch (error) {
      toast.error("Could not fetch cafe list.");
      throw error;
  }
};

export const adminGetCafeById = async (cafeId) => {
  const { data } = await adminApiClient.get(`/cafes/${cafeId}`);
  return data;
};

export const adminUpdateCafeStatus = async (cafeId, status) => {
  const { data } = await adminApiClient.put(`/cafes/${cafeId}/status`, { status });
  return data;
};

export const adminApproveCafe = async (cafeId) => {
  const { data } = await adminApiClient.put(`/cafes/${cafeId}/approve`);
  return data;
};

export const adminRejectCafe = async (cafeId, reason) => {
  const { data } = await adminApiClient.delete(`/cafes/${cafeId}/reject`, { data: { reason } });
  return data;
};

export const adminCreateEvent = async (formData) => {
  try {
    const response = await adminApiClient.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('Event created successfully!');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to create event.');
    throw error;
  }
}

export const adminGetPendingClaims = async () => {
  try {
    // ✅ Fixed: Removed hardcoded URL here too
    const res = await adminApiClient.get("/claims/pending");
    return res.data;
  } catch (err) {
    toast.error("Failed to fetch claims");
    throw err;
  }
};

export const adminApproveClaim = async (id) => {
  try {
    const res = await adminApiClient.put(`/claims/${id}/approve`);
    toast.success("Claim approved ✅");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to approve claim");
    throw err;
  }
};

export const adminRejectClaim = async (id) => {
  try {
    const res = await adminApiClient.put(`/claims/${id}/reject`);
    toast.success("Claim rejected ❌");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to reject claim");
    throw err;
  }
};

export const createAnnouncement = async (data) => {
  try {
    const response = await adminApiClient.post('/announcements', data);
    toast.success('Announcement Posted! 📢');
    return response.data;
  } catch (error) {
    toast.error('Failed to post announcement.');
    throw error;
  }
};

export const adminGetAnnouncements = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/announcements`);
  return response.data;
};

export const adminDeleteAnnouncement = async (id) => {
  try {
    const { data } = await adminApiClient.delete(`/announcements/${id}`);
    toast.success('Announcement deleted successfully');
    return data;
  } catch (error) {
    toast.error('Failed to delete announcement');
    throw error;
  }
};

export const getContactSubmissions = async () => {
  const { data } = await adminApiClient.get('/contact-submissions');
  return data;
};

export const deleteContactSubmission = async (id) => {
  const { data } = await adminApiClient.delete(`/contact-submissions/${id}`);
  return data;
};

export const deleteAllContactSubmissions = async () => {
  const { data } = await adminApiClient.delete('/contact-submissions');
  return data;
};