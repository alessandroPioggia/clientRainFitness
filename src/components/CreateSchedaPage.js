import React, { useState, useEffect } from 'react';
import { createScheda } from '../services/schedaService';
import { getExercises } from '../services/exerciseService';

const CreateSchedaPage = ({ onNavigate, user }) => {
    const [schedaParams, setSchedaParams] = useState({
        name: '',
        category: '',
        level: '',
        objective: '',
        type: '',
        duration: '',
        description: ''
    });
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [showExercises, setShowExercises] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [exerciseDetails, setExerciseDetails] = useState({});
    const [exerciseList, setExerciseList] = useState([]);
    const [exerciseCategory, setExerciseCategory] = useState('');
    const [isLoadingExercises, setIsLoadingExercises] = useState(false);

    // Primo useEffect per il controllo dell'utente e caricamento esercizi
    useEffect(() => {
        if (!user) {
            onNavigate('login');
            return;
        }
        loadExercises();
    }, [user, onNavigate]); // Aggiunte entrambe le dipendenze


    // Secondo useEffect per il controllo dell'utente dal localStorage
    useEffect(() => {
        const userFromStorage = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!userFromStorage) {
            onNavigate('login');
        }
    }, [onNavigate]); // Aggiunta la dipendenza onNavigate


    const loadExercises = async () => {
        try {
            setIsLoadingExercises(true);
            const exercises = await getExercises();
            setExerciseList(exercises);
        } catch (error) {
            setError('Errore nel caricamento degli esercizi: ' + error.message);
        } finally {
            setIsLoadingExercises(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSchedaParams(prev => ({ ...prev, [name]: value }));
    };

    const handleExerciseSearch = (e) => {
        setExerciseSearch(e.target.value);
        setShowExercises(e.target.value.length > 0);
    };

    const addExercise = (exercise) => {
        if (!selectedExercises.some(ex => ex._id === exercise._id)) {
            setSelectedExercises(prev => [...prev, exercise]);
            setExerciseDetails(prev => ({
                ...prev,
                [exercise._id]: {
                    sets: 3,
                    reps: 12,
                    rest: 60,
                    notes: ''
                }
            }));
        }
        setExerciseSearch('');
        setShowExercises(false);
    };

    const handleExerciseDetailsChange = (exerciseId, field, value) => {
        setExerciseDetails(prev => ({
            ...prev,
            [exerciseId]: {
                ...prev[exerciseId],
                [field]: value
            }
        }));
    };


    const removeExercise = (exercise) => {
        setSelectedExercises(prev => prev.filter(ex => ex._id !== exercise._id));
        setExerciseDetails(prev => {
            const newDetails = { ...prev };
            delete newDetails[exercise._id];
            return newDetails;
        });
    };

    const filteredExercises = exerciseList.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase());
        const matchesCategory = !exerciseCategory || exercise.category === exerciseCategory;
        return matchesSearch && matchesCategory;
    });


    const validateForm = () => {
        if (!schedaParams.name || !schedaParams.category || !schedaParams.level ||
            !schedaParams.objective || !schedaParams.type || !schedaParams.duration) {
            setError('Compila tutti i campi obbligatori');
            return false;
        }
        if (selectedExercises.length === 0) {
            setError('Aggiungi almeno un esercizio');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            const exercises = selectedExercises.map((exercise, index) => ({
                exerciseId: exercise._id,
                name: exercise.name,
                category: exercise.category,
                sets: Number(exerciseDetails[exercise._id]?.sets) || 3,
                reps: Number(exerciseDetails[exercise._id]?.reps) || 12,
                rest: Number(exerciseDetails[exercise._id]?.rest) || 60,
                notes: exerciseDetails[exercise._id]?.notes || '',
                order: index + 1  // Aggiungiamo questo campo
            }));

            const schedaData = {
                name: schedaParams.name,
                category: schedaParams.category,
                level: schedaParams.level,
                objective: schedaParams.objective,
                type: schedaParams.type,
                duration: schedaParams.duration,
                exercises: exercises
            };

            await createScheda(schedaData); // Rimossa la variabile savedScheda non utilizzata
            setSuccess(true);


        } catch (error) {
            console.error('Errore durante il salvataggio:', error);
            setError(error.message || 'Errore nella creazione della scheda');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-scheda-page">
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
                <h2>Crea Nuova Scheda</h2>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="success-message">
                        Scheda creata con successo!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-scheda-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome della scheda"
                        value={schedaParams.name}
                        onChange={handleInputChange}
                    />

                    <select name="category" value={schedaParams.category} onChange={handleInputChange}>
                        <option value="">Seleziona categoria</option>
                        <option value="forza">Forza</option>
                        <option value="ipertrofia">Ipertrofia</option>
                        <option value="resistenza">Resistenza</option>
                        <option value="dimagrimento">Dimagrimento</option>
                    </select>

                    <select name="level" value={schedaParams.level} onChange={handleInputChange}>
                        <option value="">Seleziona livello</option>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzato">Avanzato</option>
                    </select>

                    <select name="objective" value={schedaParams.objective} onChange={handleInputChange}>
                        <option value="">Seleziona obiettivo</option>
                        <option value="massa">Aumento massa muscolare</option>
                        <option value="definizione">Definizione muscolare</option>
                        <option value="perdita-peso">Perdita di peso</option>
                        <option value="tonificazione">Tonificazione</option>
                    </select>

                    <select name="type" value={schedaParams.type} onChange={handleInputChange}>
                        <option value="">Seleziona tipologia</option>
                        <option value="fullbody">Full Body</option>
                        <option value="split">Split</option>
                        <option value="upperlower">Upper/Lower</option>
                        <option value="push-pull-legs">Push/Pull/Legs</option>
                    </select>

                    <select name="duration" value={schedaParams.duration} onChange={handleInputChange}>
                        <option value="">Seleziona durata</option>
                        <option value="30min">30 minuti</option>
                        <option value="45min">45 minuti</option>
                        <option value="60min">60 minuti</option>
                        <option value="90min">90 minuti</option>
                    </select>

                    <textarea
                        name="description"
                        placeholder="Descrizione della scheda (opzionale)"
                        value={schedaParams.description}
                        onChange={handleInputChange}
                        rows="4"
                    />

                    <div className="exercise-search-section">
                        <div className="exercise-filters">
                            <select
                                value={exerciseCategory}
                                onChange={(e) => setExerciseCategory(e.target.value)}
                                className="category-filter"
                            >
                                <option value="">Tutte le categorie</option>
                                <option value="chest">Petto</option>
                                <option value="back">Schiena</option>
                                <option value="legs">Gambe</option>
                                <option value="shoulders">Spalle</option>
                                <option value="arms">Braccia</option>
                                <option value="core">Addominali</option>
                                <option value="cardio">Cardio</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Cerca esercizi"
                                value={exerciseSearch}
                                onChange={handleExerciseSearch}
                                className="exercise-search-input"
                            />
                        </div>

                        {isLoadingExercises && <div className="loading">Caricamento esercizi...</div>}

                        {showExercises && (
                            <ul className="exercise-list">
                                {filteredExercises.map((exercise) => (
                                    <li
                                        key={exercise._id}
                                        onClick={() => addExercise(exercise)}
                                        className="exercise-item"
                                    >
                                        <div className="exercise-name">{exercise.name}</div>
                                        <div className="exercise-details">
                                            <span className="exercise-category">{exercise.category}</span>
                                            <span className="exercise-level">{exercise.level}</span>
                                        </div>
                                    </li>
                                ))}
                                {filteredExercises.length === 0 && (
                                    <li className="no-results">Nessun esercizio trovato</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="selected-exercises">
                        <h3>Esercizi selezionati:</h3>
                        {selectedExercises.map((exercise, index) => (
                            <div key={exercise._id} className="exercise-item">
                                <div className="exercise-header">
                                    <span className="exercise-number">{index + 1}.</span>
                                    <span className="exercise-name">{exercise.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeExercise(exercise)}
                                        className="remove-button"
                                    >
                                        Rimuovi
                                    </button>
                                </div>
                                <div className="exercise-details">
                                    <div className="detail-group">
                                        <label>Serie:</label>
                                        <input
                                            type="number"
                                            value={exerciseDetails[exercise._id]?.sets || ''}
                                            onChange={(e) => handleExerciseDetailsChange(exercise._id, 'sets', parseInt(e.target.value))}
                                            min="1"
                                            max="10"
                                        />
                                    </div>
                                    <div className="detail-group">
                                        <label>Ripetizioni:</label>
                                        <input
                                            type="number"
                                            value={exerciseDetails[exercise._id]?.reps || ''}
                                            onChange={(e) => handleExerciseDetailsChange(exercise._id, 'reps', parseInt(e.target.value))}
                                            min="1"
                                            max="100"
                                        />
                                    </div>
                                    <div className="detail-group">
                                        <label>Recupero (sec):</label>
                                        <input
                                            type="number"
                                            value={exerciseDetails[exercise._id]?.rest || ''}
                                            onChange={(e) => handleExerciseDetailsChange(exercise._id, 'rest', parseInt(e.target.value))}
                                            min="0"
                                            max="300"
                                        />
                                    </div>
                                    <div className="detail-group">
                                        <label>Note:</label>
                                        <input
                                            type="text"
                                            value={exerciseDetails[exercise._id]?.notes || ''}
                                            onChange={(e) => handleExerciseDetailsChange(exercise._id, 'notes', e.target.value)}
                                            placeholder="Note opzionali"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="create-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creazione in corso...' : 'Crea Scheda'}
                    </button>
                </form>

                {selectedExercises.length > 0 && (
                    <div className="scheda-preview">
                        <h3>Anteprima Scheda</h3>
                        <div className="preview-content">
                            <p><strong>Nome:</strong> {schedaParams.name || 'Non specificato'}</p>
                            <p><strong>Categoria:</strong> {schedaParams.category || 'Non specificata'}</p>
                            <p><strong>Livello:</strong> {schedaParams.level || 'Non specificato'}</p>
                            <p><strong>Obiettivo:</strong> {schedaParams.objective || 'Non specificato'}</p>
                            <p><strong>Tipologia:</strong> {schedaParams.type || 'Non specificata'}</p>
                            <p><strong>Durata:</strong> {schedaParams.duration || 'Non specificata'}</p>
                            <h4>Esercizi:</h4>
                            <ul>
                                {selectedExercises.map((exercise, index) => (
                                    <li key={exercise._id}>
                                        <strong>{index + 1}. {exercise.name}</strong>
                                        <br/>
                                        Serie: {exerciseDetails[exercise._id]?.sets || 3},
                                        Ripetizioni: {exerciseDetails[exercise._id]?.reps || 12},
                                        Recupero: {exerciseDetails[exercise._id]?.rest || 60}s
                                        {exerciseDetails[exercise._id]?.notes && (
                                            <><br/>Note: {exerciseDetails[exercise._id].notes}</>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {schedaParams.description && (
                                <>
                                    <h4>Descrizione:</h4>
                                    <p>{schedaParams.description}</p>
                                </>
                            )}
                            {user.userType === 'trainer' && (
                                <div className="publish-status">
                                    <p><strong>Stato:</strong> Sarà pubblicata automaticamente</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CreateSchedaPage;