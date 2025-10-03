import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Artwork API functions
export const artworkAPI = {
  getAll: () => API.get('/artworks'),
  create: (artwork) => API.post('/artworks', artwork),
  getById: (id) => API.get(`/artworks/${id}`),
  update: (id, artwork) => API.put(`/artworks/${id}`, artwork),
  delete: (id) => API.delete(`/artworks/${id}`),
  like: (id) => API.post(`/artworks/${id}/like`)
};

// Auth API functions  
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile')
};

export default API;    