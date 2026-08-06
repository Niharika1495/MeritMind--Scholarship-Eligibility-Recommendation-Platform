import { apiRequest } from "./apiClient";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  list: async (): Promise<NotificationItem[]> => {
    return apiRequest<NotificationItem[]>("GET", "/notifications");
  },

  markRead: async (id: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("POST", `/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>("POST", "/notifications/read-all");
  },
};
