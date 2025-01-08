import React, { useState } from 'react';
import api from '../utils/api';

const SchedeSearchPage = ({ onNavigate }) => {
    const [searchParams, setSearchParams] = useState({
        query: '',
        category: '',
        level: '',
        objective: '',
        type: '',
        duration: ''
    });
    const [schede, setSchede] = useState([]);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();

            // Aggiungi i parametri alla query string se sono presenti
            if (searchParams.category) params.append('category', searchParams.category);
            if (searchParams.level) params.append('level', searchParams.level);
            if (searchParams.objective) params.append('objective', searchParams.objective);
            if (searchParams.type) params.append('type', searchParams.type);
            if (searchParams.duration) params.append('duration', searchParams.duration);
            if (searchParams.query) params.append('query', searchParams.query);

            const response = await api.get(`/api/schede?${params.toString()}`);
            setSchede(response.data);
        } catch (error) {
            console.error('Errore nella ricerca:', error);
            setError('Errore durante la ricerca delle schede');
        }
    };

    return (
        <div className="schede-search-page">
            <header className="fixed-header">
                <div className="logo">RAIN FITNESS</div>
                <nav>
                    <button onClick={() => onNavigate('home')}>Home</button>
                    <button className="active">Schede</button>
                    <button onClick={() => onNavigate('profile')}>Profilo</button>
                    <button onClick={() => onNavigate('chat')}>Chat</button>
                    <button onClick={() => onNavigate('support')}>Supporto</button>
                </nav>
            </header>
            <main>
                <h2>Ricerca Schede</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        name="query"
                        placeholder="Cerca..."
                        value={searchParams.query}
                        onChange={handleInputChange}
                    />
                    <select name="category" value={searchParams.category} onChange={handleInputChange}>
                        <option value="">Tutte le categorie</option>
                        <option value="forza">Forza</option>
                        <option value="ipertrofia">Ipertrofia</option>
                        <option value="resistenza">Resistenza</option>
                        <option value="dimagrimento">Dimagrimento</option>
                    </select>
                    <select name="level" value={searchParams.level} onChange={handleInputChange}>
                        <option value="">Tutti i livelli</option>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzato">Avanzato</option>
                    </select>
                    <select name="objective" value={searchParams.objective} onChange={handleInputChange}>
                        <option value="">Tutti gli obiettivi</option>
                        <option value="massa">Aumento massa muscolare</option>
                        <option value="definizione">Definizione muscolare</option>
                        <option value="perdita-peso">Perdita di peso</option>
                        <option value="tonificazione">Tonificazione</option>
                    </select>
                    <select name="type" value={searchParams.type} onChange={handleInputChange}>
                        <option value="">Tutte le tipologie</option>
                        <option value="fullbody">Full Body</option>
                        <option value="split">Split</option>
                        <option value="upperlower">Upper/Lower</option>
                        <option value="push-pull-legs">Push/Pull/Legs</option>
                    </select>
                    <select name="duration" value={searchParams.duration} onChange={handleInputChange}>
                        <option value="">Tutte le durate</option>
                        <option value="30min">30 minuti</option>
                        <option value="45min">45 minuti</option>
                        <option value="60min">60 minuti</option>
                        <option value="90min">90 minuti</option>
                    </select>
                    <button type="submit" className="search-button">Mostra risultati</button>
                </form>

                <div className="schede-results">
                    {schede.map((scheda) => (
                        <div key={scheda._id} className="scheda-card">
                            <h3>{scheda.name}</h3>
                            <p>Categoria: {scheda.category}</p>
                            <p>Livello: {scheda.level}</p>
                            <p>Obiettivo: {scheda.objective}</p>
                            <p>Tipo: {scheda.type}</p>
                            <p>Durata: {scheda.duration}</p>
                            <p>Creato da: {scheda.creator?.username}</p>
                            <button
                                onClick={() => onNavigate('scheda-detail', {schedaId: scheda._id})}
                                className="view-details-button"
                            >
                                Visualizza Dettagli
                            </button>
                        </div>
                    ))}
                    {schede.length === 0 && <p>Nessuna scheda trovata</p>}
                </div>

                <button
                    onClick={() => onNavigate('create-scheda')}
                    className="create-scheda-button"
                >
                    Crea nuova scheda
                </button>
            </main>
        </div>
    );
};

export default SchedeSearchPage;