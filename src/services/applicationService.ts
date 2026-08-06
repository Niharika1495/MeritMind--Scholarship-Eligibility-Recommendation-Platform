import { apiRequest } from "./apiClient";
import type { Scholarship } from "@/types/scholarship";

export interface ApplicationItem {
  id: number;
  scholarshipId: string;
  status: string;
  appliedAt: string;
  scholarship: Scholarship;
}

export const applicationService = {
  list: async (): Promise<ApplicationItem[]> => {
    return apiRequest<ApplicationItem[]>("GET", "/applications");
  },

  apply: async (scholarshipId: string, status = "Applied"): Promise<ApplicationItem> => {
    return apiRequest<ApplicationItem>("POST", "/applications", { scholarshipId, status });
  },

  updateStatus: async (id: number, status: string): Promise<ApplicationItem> => {
    return apiRequest<ApplicationItem>("PUT", `/applications/${id}/status`, { status });
  },

  cancel: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("DELETE", `/applications/${id}`);
  },
};
