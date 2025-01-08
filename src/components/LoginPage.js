import React, { useState } from "react";
import { login } from '../utils/auth';

const LoginPage = ({ onNavigate, onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting login with:', credentials); // Log dei dati inviati
            const response = await login(credentials);
            console.log('Login response:', response); // Log della risposta
            onLogin(response.user);
            onNavigate('home');
        } catch (err) {
            console.error('Login error:', err); // Log dell'errore
            setError(err.message || 'Errore durante il login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <h2>Accedi</h2>
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
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nome utente"
                    value={credentials.username}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Accesso in corso...' : 'Accedi'}
                </button>
            </form>
            <button onClick={() => onNavigate('home')} disabled={isLoading}>
                Torna alla Home
            </button>
        </div>
    );
};

export default LoginPage;