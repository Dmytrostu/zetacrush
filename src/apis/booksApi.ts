// Book upload and summary API calls
import { api, API_BASE_URL } from './apiConfig';

export interface BookSummary {
  characters: string[];
  synopsis: string;
  easterEgg: string;
}

export const booksApi = {  uploadBook: async (file: File): Promise<BookSummary> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use the upload endpoint as specified in requirements
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  getBookHistory: async (): Promise<any[]> => {
    const response = await api.get('/books/history');
    return response.data;
  },
  
  getBookSummary: async (bookId: string): Promise<BookSummary> => {
    const response = await api.get(`/books/${bookId}/summary`);
    return response.data;
  }
};
