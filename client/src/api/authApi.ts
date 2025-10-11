import axios from "axios";
import type { LoginResponse, User } from "../types/AuthInterfaces";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Local storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// Utility functions for token management
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true; // If we can't decode, assume expired
  }
};

export const getTokenExpiryTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
};

export const isTokenExpiringSoon = (token: string, minutesBeforeExpiry: number = 5): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000;
    const warningTime = expiryTime - (minutesBeforeExpiry * 60 * 1000);
    return Date.now() >= warningTime;
  } catch {
    return true;
  }
};

// Utility functions for localStorage
export const saveAuthData = (accessToken: string, user: User, refreshToken?: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  
  // Store expiry time for easy checking
  const expiryTime = getTokenExpiryTime(accessToken);
  if (expiryTime) {
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  
  // Check if token exists and is not expired
  if (token && !isTokenExpired(token)) {
    return token;
  }
  
  // If expired, clear auth data and return null
  if (token && isTokenExpired(token)) {
    clearAuthData();
    return null;
  }
  
  return token;
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getUserData = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  // Also clear the duplicate authToken
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return !!(token && !isTokenExpired(token));
};


export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refresh_token: refreshToken
    });

    const data = response.data;
    
    if (data.access_token && data.user) {
      saveAuthData(data.access_token, data.user, data.refresh_token);
      return data.access_token;
    }
    
    throw new Error('Invalid refresh response');
  } catch (error: any) {
    console.error('Failed to refresh token:', error);
    clearAuthData();
    return null;
  }
};

export const getValidAccessToken = async (): Promise<string | null> => {
  let token = localStorage.getItem(ACCESS_TOKEN_KEY);
  
  if (!token) {
    return null;
  }
  
  // If token is expiring soon, try to refresh it
  if (isTokenExpiringSoon(token)) {
    const newToken = await refreshAccessToken();
    return newToken;
  }
  
  // If token is already expired, try to refresh
  if (isTokenExpired(token)) {
    const newToken = await refreshAccessToken();
    return newToken;
  }
  
  return token;
};

export const login = async (email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { 
      email, 
      password, 
      remember_me: rememberMe 
    });
    const data = response.data;
    
    // Save access token and user data to localStorage
    if (data.access_token && data.user) {
      saveAuthData(data.access_token, data.user, data.refresh_token);
      // Also save to authToken for backward compatibility (will be removed later)
      localStorage.setItem('authToken', data.access_token);
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
