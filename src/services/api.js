import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,


  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
