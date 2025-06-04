import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async login(email, password) {
            try {
                // 1) Pošaljemo POST /api/login s email + password
                const response = await axios.post('http://localhost:8000/api/login', {
                    email,
                    password
                });

                // 2) Backend vraća { token, user }
                const { token, user } = response.data;

                // 3) Pohranimo korisnika i token
                this.user = user;
                this.token = token;

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);

                // 4) Postavimo Bearer header u globalni axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                return true;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },
        logout() {
            // 1) Pošaljemo POST /api/logout (opcijski)
            axios.post('http://localhost:8000/api/logout')
                .catch(() => { /* ignoriraj greške u logoutu */ });

            // 2) Obrišemo user i token iz store-a i localStorage
            this.user = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        },
        isAdmin() {
            return this.user?.role === 'admin';
        },
        isCreator() {
            return ['admin', 'creator'].includes(this.user?.role);
        },
        isLoggedIn() {
            return !!this.user;
        },
        setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        setUser(user) {
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        }
    }
});