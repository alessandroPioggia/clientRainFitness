import api from '../utils/api';

export const createScheda = async (schedaData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.post('/api/schede', schedaData, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Errore nella creazione della scheda:', error);
        throw error.response?.data || { message: 'Errore nella creazione della scheda' };
    }
};