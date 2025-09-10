import axios from "axios";
import type { LoginResponse, User } from "../types/AuthInterfaces";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Local storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const USER_DATA_KEY = 'user_data';

// Utility functions for localStorage
export const saveAuthData = (accessToken: string, user: User) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getUserData = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};


export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const data = response.data;
    
    // Save access token and user data to localStorage
    if (data.access_token && data.user) {
      saveAuthData(data.access_token, data.user);
    }
    
    return data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Login failed");
  }
};

export const signup = async (email: string, password: string, first_name: string, last_name: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { email, password, first_name, last_name });
    // Handle successful signup response

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Signup failed");
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify-email?token=${token}`);
    const data = response.data;
    
    // Save access token and user data to localStorage if present
    if (data.access_token && data.user) {
      saveAuthData(data.access_token, data.user);
    }
    
    return data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Email verification failed");
  }
};

export const forgotPassword = async (email: string) => {
  return axios.post(`${API_URL}/auth/forgot-password`, { email });
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password?token=${token}`, { newPassword });
    const data = response.data;
    
    // Save access token and user data to localStorage if present
    if (data.access_token && data.user) {
      saveAuthData(data.access_token, data.user);
    }
    
    return data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Password reset failed");
  }
};

export const logout = () => {
  clearAuthData();
};
