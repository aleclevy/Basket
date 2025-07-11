import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const questionsAPI = {
  getTodaysQuestion: async () => {
    const response = await api.get('/questions/today');
    return response.data;
  },
  
  submitResponse: async (questionId: number, responseText: string) => {
    const response = await api.post('/questions/respond', { questionId, responseText });
    return response.data;
  },
  
  getMyResponses: async () => {
    const response = await api.get('/questions/my-responses');
    return response.data;
  },
};

export default api;