import { apiRequest } from "./apiClient";
import type { ProfileData } from "@/contexts/AuthContext";

export const profileService = {
  get: async (): Promise<ProfileData> => {
    return apiRequest<ProfileData>("GET", "/profile");
  },

  update: async (profile: Partial<ProfileData>): Promise<ProfileData> => {
    return apiRequest<ProfileData>("PUT", "/profile", profile);
  },
};
