import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) =>
  api.post('/login', { username, password }).then(res => res.data);

export const register = (username, email, password) =>
  api.post('/register', { username, email, password }).then(res => res.data);

export const getProfile = () =>
  api.get('/profile', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
  }).then(res => res.data);


export default api;
