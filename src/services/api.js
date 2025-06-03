import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true, // ako koristiš session/cookie auth
    headers: {
        Accept: 'application/json',
    },
});
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Basic ${token}`;
    }
    return config;
});
export default api;