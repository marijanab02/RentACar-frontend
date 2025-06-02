import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Attach credentials to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Basic ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;