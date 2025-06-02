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
                // Pošalji POST /api/login s email + password
                const response = await axios.post('http://rentacar.test/api/login', {
                    email,
                    password
                });

                // Ako je status 200, backend vraća { message, user }
                this.user = response.data.user;

                // Spremi Base64 token (= Basic Auth credentials)
                this.token = btoa(`${email}:${password}`);

                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('token', this.token);

                // Postavi u defaultni axios header Basic Auth
                axios.defaults.headers.common['Authorization'] = `Basic ${this.token}`;

                return true;
            } catch (error) {
                console.error('Login failed:', error);
                return false;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            // Ukloni Authorization zaglavlje
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
        }
    }
});