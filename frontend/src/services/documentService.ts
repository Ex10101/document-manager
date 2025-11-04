import api from '../utils/api';

export interface Document {
  id: number;
  title: string;
  originalFilename: string;
  tag?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  documents: Document[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateDocumentData {
  title: string;
  tag?: string;
  file: File;
}

export interface UpdateDocumentData {
  title?: string;
  tag?: string;
}

export const documentService = {
  async getDocuments(page = 1, limit = 10, tag?: string): Promise<DocumentsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (tag) {
      params.append('tag', tag);
    }

    const response = await api.get<DocumentsResponse>(`/documents?${params.toString()}`);
    return response.data;
  },

  async createDocument(data: CreateDocumentData): Promise<{ message: string; document: Document }> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('file', data.file);

    if (data.tag) {
      formData.append('tag', data.tag);
    }

    const response = await api.post<{ message: string; document: Document }>(
      '/documents',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async updateDocument(id: number, data: UpdateDocumentData): Promise<{ message: string; document: Document }> {
    const response = await api.put<{ message: string; document: Document }>(
      `/documents/${id}`,
      data
    );
    return response.data;
  },

  async deleteDocument(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/documents/${id}`);
    return response.data;
  },

  async downloadDocument(id: number, filename: string): Promise<void> {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });

    // Create a download link and trigger it
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async getTags(): Promise<{ tags: string[] }> {
    const response = await api.get<{ tags: string[] }>('/documents/tags/list');
    return response.data;
  },
};
