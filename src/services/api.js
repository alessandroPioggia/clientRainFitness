import axios from 'axios';

const api = axios.create({
    baseURL: 'https://serverrainfitness.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Interceptor per il debug
api.interceptors.request.use(request => {
    console.log('Starting Request:', request);
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