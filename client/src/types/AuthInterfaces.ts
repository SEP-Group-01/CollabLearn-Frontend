export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    email_verified: boolean;
  };
}

export interface SignupResponse {
  message?: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    email_verified: boolean;
  };
}