import axios from 'axios';
 const API_BASE_URL = 'http://localhost:5000/api';
 // Create axios instance
 const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
 });
 // Add token to requests if available
 api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
 );
 // Handle token expiration
 api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
 );
 // Auth API calls
 export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
 };
 // Books API calls
 export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`),
  getGenres: () => api.get('/books/genres'),
 };
 // Borrows API calls
 export const borrowsAPI = {
  borrowBook: (bookId) => api.post('/borrows/borrow', { bookId }),
  returnBook: (borrowId) => api.put(`/borrows/return/${borrowId}`),
  getMyBorrows: () => api.get('/borrows/my-borrows'),
  getAllBorrows: () => api.get('/borrows/all'),
  getOverdue: () => api.get('/borrows/overdue'),
 };
 export default api;