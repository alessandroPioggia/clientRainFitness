import api from './api';

export const getTrainers = async (filters = {}) => {
    try {
        const response = await api.get('/trainers', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Errore nel recupero dei trainer' };
    }
};

export const getTrainerDetails = async (trainerId) => {
    try {
        const response = await api.get(`/trainers/${trainerId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Errore nel recupero dei dettagli del trainer' };
    }
};

export const getTrainerReviews = async (trainerId) => {
    try {
        const response = await api.get(`/trainers/${trainerId}/reviews`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Errore nel recupero delle recensioni' };
    }
};