import apiClient from './client';

export interface Tag {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  starred: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteIn {
  title: string;
  content: string;
  tags?: string[];
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface NotesListParams {
  search?: string;
  tag?: string;
  starred?: boolean;
}

export const notesApi = {
  /**
   * Get all notes with optional filters.
   */
  list: async (params?: NotesListParams): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>('/notes', { params });
    return response.data;
  },

  /**
   * Get a single note by ID.
   */
  get: async (id: number): Promise<Note> => {
    const response = await apiClient.get<Note>(`/notes/${id}`);
    return response.data;
  },

  /**
   * Create a new note.
   */
  create: async (data: NoteIn): Promise<Note> => {
    const response = await apiClient.post<Note>('/notes', data);
    return response.data;
  },

  /**
   * Update an existing note.
   */
  update: async (id: number, data: NoteUpdate): Promise<Note> => {
    const response = await apiClient.put<Note>(`/notes/${id}`, data);
    return response.data;
  },

  /**
   * Delete a note.
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  },

  /**
   * Toggle star status of a note.
   */
  toggleStar: async (id: number): Promise<Note> => {
    const response = await apiClient.post<Note>(`/notes/${id}/star`);
    return response.data;
  },

  /**
   * Get recent notes.
   */
  recent: async (limit: number = 10): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>('/notes/recent', {
      params: { limit },
    });
    return response.data;
  },
};

