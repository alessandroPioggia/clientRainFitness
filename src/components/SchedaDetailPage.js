import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const SchedaDetailPage = ({ onNavigate, schedaId }) => {
    const [scheda, setScheda] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Wrapping loadScheda in useCallback to prevent infinite loops
    const loadScheda = useCallback(async () => {
        try {
            const response = await api.get(`/api/schede/${schedaId}`);
            setScheda(response.data);
        } catch (error) {
            setError('Errore nel caricamento della scheda');
            console.error('Errore:', error);
        } finally {
            setLoading(false);
        }
    }, [schedaId]); // schedaId come dipendenza di useCallback

    useEffect(() => {
        loadScheda();
    }, [loadScheda]); // loadScheda come dipendenza di useEffect

    if (loading) return <div>Caricamento...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!scheda) return <div>Scheda non trovata</div>;

    return (
        <div className="scheda-detail-page">
            <header className="fixed-header">
                <div className="logo">RAIN FITNESS</div>
                <nav>
                    <button onClick={() => onNavigate('home')}>Home</button>
                    <button onClick={() => onNavigate('search')}>Schede</button>
                    <button onClick={() => onNavigate('profile')}>Profilo</button>
                    <button onClick={() => onNavigate('chat')}>Chat</button>
                    <button onClick={() => onNavigate('support')}>Supporto</button>
                </nav>
            </header>

            <main>
                <div className="scheda-detail">
                    <h2>{scheda.name}</h2>
                    <div className="scheda-info">
                        <p><strong>Categoria:</strong> {scheda.category}</p>
                        <p><strong>Livello:</strong> {scheda.level}</p>
                        <p><strong>Obiettivo:</strong> {scheda.objective}</p>
                        <p><strong>Tipo:</strong> {scheda.type}</p>
                        <p><strong>Durata:</strong> {scheda.duration}</p>
                        <p><strong>Creato da:</strong> {scheda.creator?.username}</p>
                    </div>

                    <div className="exercises-list">
                        <h3>Esercizi:</h3>
                        {scheda.exercises.map((exercise, index) => (
                            <div key={index} className="exercise-item">
                                <h4>{exercise.name}</h4>
                                <p><strong>Serie:</strong> {exercise.sets}</p>
                                <p><strong>Ripetizioni:</strong> {exercise.reps}</p>
                                <p><strong>Recupero:</strong> {exercise.rest} secondi</p>
                                {exercise.notes && <p><strong>Note:</strong> {exercise.notes}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SchedaDetailPage;