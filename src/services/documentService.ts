import { apiRequest } from "./apiClient";

export type VaultDocument = {
  id: string;
  docType: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
};

export const documentService = {
  list: async (): Promise<VaultDocument[]> => {
    try {
      return await apiRequest<VaultDocument[]>("GET", "/documents");
    } catch {
      return [];
    }
  },

  upload: async (file: File, docType: string): Promise<VaultDocument> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    const token = localStorage.getItem("meritmind_token");
    const response = await fetch("http://127.0.0.1:8000/api/documents/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload document");
    }

    return response.json();
  },

  delete: async (docId: string): Promise<void> => {
    await apiRequest("DELETE", `/documents/${docId}`);
  },

  downloadUrl: (docId: string): string => {
    return `http://127.0.0.1:8000/api/documents/${docId}/download`;
  },
};
