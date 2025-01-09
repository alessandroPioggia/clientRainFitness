import api from '../utils/api';

export const updateUserProfile = async (userData) => {
    try {
        const response = await api.put('/api/users/profile', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Errore durante l\'aggiornamento del profilo' };
    }
};

export const getUserProfile = async () => {
    try {
        const response = await api.get('/api/users/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Errore nel recupero del profilo' };
    }
};

export const uploadProfilePhoto = async (photoFile) => {
    try {
        const formData = new FormData();
        formData.append('photo', photoFile);

        const response = await api.put('/api/users/profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Errore durante l\'upload della foto' };
    }
};

export const updateUserMeasurements = async (measurements) => {
    try {
        const response = await api.put('/api/users/profile/measurements', measurements);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Errore durante l\'aggiornamento delle misure' };
    }
};