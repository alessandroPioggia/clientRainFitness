import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import GamificationComponent from './GamificationComponent';

const ProfilePage = ({ onNavigate, user }) => {
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('info');
    const [userSchede, setUserSchede] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        profile: {
            photo: null,
            height: '',
            weight: '',
            measurements: {
                chest: '',
                waist: '',
                hips: '',
                biceps: '',
                thighs: ''
            }
        }
    });

    useEffect(() => {
        loadUserProfile();
        loadUserSchede();
    }, []);

    const loadUserProfile = async () => {
        try {
            const response = await api.get('/api/users/profile');
            setUserData(prev => ({
                ...prev,
                username: response.data.username || '',
                email: response.data.email || '',
                profile: {
                    photo: response.data.profile?.photo || null,
                    height: response.data.profile?.height || '',
                    weight: response.data.profile?.weight || '',
                    measurements: {
                        chest: response.data.profile?.measurements?.chest || '',
                        waist: response.data.profile?.measurements?.waist || '',
                        hips: response.data.profile?.measurements?.hips || '',
                        biceps: response.data.profile?.measurements?.biceps || '',
                        thighs: response.data.profile?.measurements?.thighs || ''
                    }
                }
            }));
        } catch (error) {
            setError('Errore nel caricamento del profilo');
        }
    };

    const loadUserSchede = async () => {
        try {
            const response = await api.get('/api/schede/user');
            setUserSchede(response.data);
        } catch (error) {
            console.error('Errore nel caricamento delle schede:', error);
            setError('Errore nel caricamento delle schede');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('measurements.')) {
            const measurementField = name.split('.')[1];
            setUserData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    measurements: {
                        ...prev.profile.measurements,
                        [measurementField]: value
                    }
                }
            }));
        } else if (name.includes('profile.')) {
            const profileField = name.split('.')[1];
            setUserData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value
                }
            }));
        } else {
            setUserData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePhotoChange = (e) => {
        if (e.target.files?.[0]) {
            setUserData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    photo: e.target.files[0]
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('username', userData.username);
            formData.append('email', userData.email);

            if (userData.currentPassword && userData.newPassword) {
                formData.append('currentPassword', userData.currentPassword);
                formData.append('newPassword', userData.newPassword);
            }

            formData.append('height', userData.profile.height);
            formData.append('weight', userData.profile.weight);

            Object.entries(userData.profile.measurements).forEach(([key, value]) => {
                if (value) {
                    formData.append(`measurements[${key}]`, value);
                }
            });

            if (userData.profile.photo instanceof File) {
                formData.append('photo', userData.profile.photo);
            }

            await api.put('/api/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Profilo aggiornato con successo');
            await loadUserProfile();
            setEditMode(false);
        } catch (error) {
            console.error('Errore durante l\'aggiornamento:', error);
            setError(error.response?.data?.message || 'Errore durante l\'aggiornamento del profilo');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderWorkouts = () => {
        if (userSchede.length === 0) {
            return <p>Nessuna scheda trovata</p>;
        }

        return (
            <div className="workouts-grid">
                {userSchede.map(scheda => (
                    <div key={scheda._id} className="workout-card">
                        <h3>{scheda.name}</h3>
                        <p>Categoria: {scheda.category}</p>
                        <p>Livello: {scheda.level}</p>
                        <p>Obiettivo: {scheda.objective}</p>
                        <p>Tipo: {scheda.type}</p>
                        <p>Durata: {scheda.duration}</p>
                        <button
                            onClick={() => onNavigate('scheda-detail', { schedaId: scheda._id })}
                            className="view-details-button"
                        >
                            Visualizza Dettagli
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="profile-page">
            <header className="fixed-header">
                <div className="logo">RAIN FITNESS</div>
                <nav>
                    <button onClick={() => onNavigate('home')}>Home</button>
                    <button onClick={() => onNavigate('search')}>Schede</button>
                    <button className="active">Profilo</button>
                    <button onClick={() => onNavigate('chat')}>Chat</button>
                    <button onClick={() => onNavigate('support')}>Supporto</button>
                </nav>
            </header>

            <main>
                <h2>Profilo Utente</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="profile-tabs">
                    <button
                        className={activeTab === 'info' ? 'active' : ''}
                        onClick={() => setActiveTab('info')}
                    >
                        Informazioni
                    </button>
                    <button
                        className={activeTab === 'workouts' ? 'active' : ''}
                        onClick={() => setActiveTab('workouts')}
                    >
                        Schede
                    </button>
                    <button
                        className={activeTab === 'gamification' ? 'active' : ''}
                        onClick={() => setActiveTab('gamification')}
                    >
                        Sfide
                    </button>
                </div>

                <div className="profile-content">
                    {activeTab === 'info' && (
                        <form onSubmit={handleSubmit}>
                            <div className="profile-photo">
                                {userData.profile.photo ? (
                                    <img
                                        src={typeof userData.profile.photo === 'string'
                                            ? userData.profile.photo
                                            : URL.createObjectURL(userData.profile.photo)}
                                        alt="Foto profilo"
                                    />
                                ) : (
                                    <div className="photo-placeholder">
                                        {userData.username ? userData.username[0].toUpperCase() : 'U'}
                                    </div>
                                )}
                                {editMode && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                    disabled={!editMode} // Questo campo sarà editabile solo in modalità modifica
                                />
                            </div>

                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    disabled={!editMode}
                                />
                            </div>

                            {editMode && (
                                <>
                                    <div className="form-group">
                                        <label>Password Attuale:</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={userData.currentPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Nuova Password:</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={userData.newPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label>Altezza (cm):</label>
                                <input
                                    type="number"
                                    name="profile.height"
                                    value={userData.profile.height}
                                    onChange={handleInputChange}
                                    disabled={!editMode}
                                />
                            </div>

                            <div className="form-group">
                                <label>Peso (kg):</label>
                                <input
                                    type="number"
                                    name="profile.weight"
                                    value={userData.profile.weight}
                                    onChange={handleInputChange}
                                    disabled={!editMode}
                                />
                            </div>

                            <h3>Misure del corpo</h3>
                            <div className="measurements-grid">
                                <div className="form-group">
                                    <label>Petto (cm):</label>
                                    <input
                                        type="number"
                                        name="measurements.chest"
                                        value={userData.profile.measurements.chest}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Vita (cm):</label>
                                    <input
                                        type="number"
                                        name="measurements.waist"
                                        value={userData.profile.measurements.waist}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fianchi (cm):</label>
                                    <input
                                        type="number"
                                        name="measurements.hips"
                                        value={userData.profile.measurements.hips}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Bicipiti (cm):</label>
                                    <input
                                        type="number"
                                        name="measurements.biceps"
                                        value={userData.profile.measurements.biceps}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Cosce (cm):</label>
                                    <input
                                        type="number"
                                        name="measurements.thighs"
                                        value={userData.profile.measurements.thighs}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>

                            {editMode ? (
                                <div className="button-group">
                                    <button type="submit" className="save-button" disabled={isSubmitting}>
                                        {isSubmitting ? 'Salvataggio...' : 'Salva Modifiche'}
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => {
                                            setEditMode(false);
                                            loadUserProfile(); // Ricarica i dati originali
                                        }}
                                    >
                                        Annulla
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setEditMode(true)}
                                    className="edit-button"
                                >
                                    Modifica Profilo
                                </button>
                            )}
                        </form>
                    )}

                    {activeTab === 'workouts' && (
                        <div className="workouts-section">
                            <h3>{user.userType === 'trainer' ? 'Schede Create' : 'Le Tue Schede'}</h3>
                            {renderWorkouts()}
                        </div>
                    )}

                    {activeTab === 'gamification' && (
                        <GamificationComponent user={user} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
