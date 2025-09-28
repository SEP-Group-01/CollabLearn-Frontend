import axios from "axios";
import type { LoginResponse, User } from "../types/AuthInterfaces";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Simple development-friendly authentication functions
export const getAccessToken = (): string | null => {
  // For development, return a mock token
  return "mock-development-token";
};

// Get user data - simplified for development
export const getUserData = (): User | null => {
  // Return consistent mock data for development with proper UUID format
  return {
    id: '53e5f9f5-fe11-4728-9996-7e606bb98f96', // Valid UUID format for development
    first_name: 'Development',
    last_name: 'User',
    email: 'dev@example.com',
    email_verified: true,
  };
};

// Clear auth data
export const clearAuthData = async () => {
  console.log('Sign out requested');
};

// Check if user is authenticated - always true for development
export const isAuthenticated = (): boolean => {
  return true;
};


export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
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
    return response.data;
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
    return response.data;
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
