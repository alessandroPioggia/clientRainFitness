import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true  // Aggiungi questa riga
});

// Aggiungi un interceptor per il debug
api.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('API Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default api;