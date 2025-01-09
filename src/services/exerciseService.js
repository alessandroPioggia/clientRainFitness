import api from '../utils/api';

export const getExercises = async () => {
    console.log('ExerciseService: Iniziando chiamata API per ottenere esercizi');
    try {
        const response = await api.get('/api/exercises');
        console.log('ExerciseService: Risposta ricevuta:', response.data);
        return response.data;
    } catch (error) {
        console.error('ExerciseService: Errore nella chiamata API:', error);
        console.error('ExerciseService: Response error:', error.response);
        throw new Error('Errore nel caricamento degli esercizi: ' + error.message);
    }
};