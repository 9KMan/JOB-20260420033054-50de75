import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  register: (data: {
    organization: {
      name: string;
      subdomain: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      phone?: string;
    };
    user: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
  }) => api.post('/api/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
};

// Churches API
export const churchesApi = {
  getCurrent: () => api.get('/api/churches/me'),
  update: (data: any) => api.patch('/api/churches/me', data),
  getStats: () => api.get('/api/churches/stats'),
  getBySubdomain: (subdomain: string) => api.get(`/api/churches/${subdomain}`),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/api/users'),
  getById: (id: string) => api.get(`/api/users/${id}`),
  create: (data: any) => api.post('/api/users', data),
  update: (id: string, data: any) => api.patch(`/api/users/${id}`, data),
  delete: (id: string) => api.delete(`/api/users/${id}`),
};

// Integrations API
export const integrationsApi = {
  getAll: () => api.get('/api/integrations'),
  getById: (id: string) => api.get(`/api/integrations/${id}`),
  create: (data: any) => api.post('/api/integrations', data),
  update: (id: string, data: any) => api.patch(`/api/integrations/${id}`, data),
  delete: (id: string) => api.delete(`/api/integrations/${id}`),
  sync: (id: string) => api.post(`/api/integrations/${id}/sync`),
};

// Jobs API
export const jobsApi = {
  getAll: () => api.get('/api/jobs'),
  getMetrics: () => api.get('/api/jobs/metrics'),
  getById: (id: string) => api.get(`/api/jobs/${id}`),
  retry: (id: string) => api.post(`/api/jobs/${id}/retry`),
  cancel: (id: string) => api.delete(`/api/jobs/${id}`),
};
