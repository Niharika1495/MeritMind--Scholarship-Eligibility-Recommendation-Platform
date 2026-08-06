import { apiRequest } from "./apiClient";

export interface UserOut {
  id: number;
  name: string;
  email: string;
  is_profile_setup_completed: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  register: async (name: string, email: string, password: string) => {
    return apiRequest<{ message: string }>("POST", "/auth/register", { name, email, password });
  },

  login: async (email: string, password: string) => {
    return apiRequest<TokenResponse>("POST", "/auth/login", { email, password });
  },

  me: async () => {
    return apiRequest<UserOut>("GET", "/auth/me");
  },

  logout: async () => {
    return apiRequest<{ message: string }>("POST", "/auth/logout");
  },
};
