import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 from the login endpoint itself — let LoginPage show the error toast
    const isLoginCall = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginCall) {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getAllUsers: () => api.get('/auth/users'),
  toggleUserStatus: (id) => api.patch(`/auth/users/${id}/toggle`)
};

export const bookAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  add: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  checkAvailability: (id) => api.get(`/books/${id}/availability`),
  getCategories: () => api.get('/books/categories')
};

export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  add: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getHistory: (id) => api.get(`/students/${id}/history`),
  getDepartments: () => api.get('/students/departments')
};

export const issueAPI = {
  getAll: (params) => api.get('/issues', { params }),
  getById: (issueId) => api.get(`/issues/${issueId}`),
  issue: (data) => api.post('/issues', data),
  return: (issueId) => api.patch(`/issues/${issueId}/return`),
  getDashboardStats: () => api.get('/issues/dashboard'),
  getFineReport: (type) => api.get('/issues/fines', { params: { type } })
};

export default api;
