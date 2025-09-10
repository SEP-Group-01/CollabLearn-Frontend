export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: User;
  refresh_token?: string;
}

export interface SignupResponse {
  message: string;
  user?: User;
}

export interface VerifyEmailResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface ResetPasswordResponse {
  message: string;
  access_token: string;
  user: User;
}