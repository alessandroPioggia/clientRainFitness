import api from '../services/api';

export const register = async (userData) => {
    try {
        console.log('Sending registration data:', userData);
        const response = await api.post('api/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error.response?.data?.message || 'Errore durante la registrazione';
    }
};

export const login = async (credentials) => {
    try {
        console.log('Attempting login with:', credentials);
        // Rimuovi eventuali slash finali dall'URL
        const response = await api.post('api/auth/login', {
            username: credentials.username,
            password: credentials.password
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('loggedInUser', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error.response?.data?.message || 'Credenziali non valide';
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const getLoggedInUser = () => {
    const userStr = localStorage.getItem('loggedInUser');
    return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};