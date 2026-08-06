import { apiRequest } from "./apiClient";

export const savedScholarshipService = {
  list: async (): Promise<string[]> => {
    return apiRequest<string[]>("GET", "/saved");
  },

  add: async (id: string): Promise<string[]> => {
    return apiRequest<string[]>("POST", `/saved/${id}`);
  },

  remove: async (id: string): Promise<string[]> => {
    return apiRequest<string[]>("DELETE", `/saved/${id}`);
  },

  clear: async (): Promise<string[]> => {
    return apiRequest<string[]>("DELETE", "/saved");
  },
};
