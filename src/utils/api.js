import axios from 'axios';

const api = axios.create({
    baseURL: 'https://serverrainfitness.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Aggiungi l'interceptor per il token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;