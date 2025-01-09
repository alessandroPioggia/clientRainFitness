import React, { useState } from "react";
import { register } from '../utils/auth';

const RegistrationPage = ({ onNavigate, onRegister }) => {
    const [userType, setUserType] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        code: '',
        cv: null
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Form data:', formData); // Debug log

            const userData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                userType: userType
            };

            console.log('Submitting user data:', userData); // Debug log
            const response = await register(userData);
            onRegister(response.user);
            onNavigate('home');
        } catch (err) {
            console.error('Registration error:', err); // Debug log
            setError(err.message || 'Errore durante la registrazione');
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = () => {
        if (!userType) {
            return (
                <div className="user-type-selection">
                    <button
                        onClick={() => setUserType('athlete')}
                        disabled={isLoading}
                    >
                        Atleta
                    </button>
                    <button
                        onClick={() => setUserType('trainer')}
                        disabled={isLoading}
                    >
                        Personal Trainer
                    </button>
                    <button
                        onClick={() => setUserType('admin')}
                        disabled={isLoading}
                    >
                        Admin
                    </button>
                </div>
            );
        }

        return (
            <form className="registration-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nome utente"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                {userType === 'admin' && (
                    <input
                        type="text"
                        name="code"
                        placeholder="Codice Admin"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    />
                )}
                {userType === 'trainer' && (
                    <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    />
                )}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Registrazione in corso...' : 'Registrati'}
                </button>
            </form>
        );
    };

    return (
        <div className="registration-page">
            <h2>Registrazione</h2>
            {error && (
                <div className="error-message" style={{
                    color: 'red',
                    backgroundColor: 'rgba(255,0,0,0.1)',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}
            {renderForm()}
            <button onClick={() => onNavigate('home')} disabled={isLoading}>
                Torna alla Home
            </button>
        </div>
    );
};

export default RegistrationPage;