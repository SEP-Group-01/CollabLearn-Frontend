import axios from "axios";
import type { LoginResponse } from "../types/AuthInterfaces";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


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
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Signup failed");
  }
};

export const verifyEmail = async (token: string) => {
  return axios.get(`${API_URL}/auth/verify_email`, { params: { token } });
};

export const forgotPassword = async (email: string) => {
  return axios.post(`${API_URL}/auth/forgot_password`, { email });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return axios.post(`${API_URL}/auth/reset_password`, { token, newPassword });
};
