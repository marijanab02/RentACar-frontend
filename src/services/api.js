import axios from 'axios';

const api = axios.create({
    baseURL: 'http://rentacar.test/api',
    withCredentials: true, // ako koristiš session/cookie auth
    headers: {
        Accept: 'application/json',
    },
});

export default api;