import { apiRequest } from "./apiClient";

export type AdvisorResponse = {
  reply: string;
  eligibleCount: number;
  totalCatalogCount: number;
};

export const advisorService = {
  chat: async (message: string): Promise<AdvisorResponse> => {
    return apiRequest<AdvisorResponse>("POST", "/advisor/chat", { message });
  },
};
