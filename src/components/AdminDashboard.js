import React, {useEffect, useState} from "react";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [appReviews, setAppReviews] = useState([]);
    const [supportMessages, setSupportMessages] = useState([]);

    useEffect(() => {
        // Simula il caricamento dei dati
        // In un'applicazione reale, questi dati verrebbero caricati da un'API o un database
        setUsers([
            { id: 1, username: 'user1', type: 'athlete' },
            { id: 2, username: 'trainer1', type: 'trainer' },
            { id: 3, username: 'user2', type: 'athlete' },
        ]);

        setAppReviews([
            { id: 1, store: 'App Store', rating: 5, text: 'Ottima app per il fitness!' },
            { id: 2, store: 'Google Play', rating: 4, text: 'Molto utile, ma potrebbe avere più funzionalità.' },
        ]);

        setSupportMessages([
            { id: 1, from: 'user1', message: 'Ho bisogno di aiuto con la mia scheda.' },
            { id: 2, from: 'trainer1', message: 'Come posso aggiungere nuovi esercizi?' },
        ]);
    }, []);

    return (
        <div className="admin-dashboard">
            <div className="dashboard-section users-list">
                <h2>Utenti Registrati</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.username} - {user.type}</li>
                    ))}
                </ul>
            </div>

            <div className="dashboard-section app-reviews">
                <h2>Recensioni dell'App</h2>
                <ul>
                    {appReviews.map(review => (
                        <li key={review.id}>
                            <strong>{review.store}</strong> - {review.rating}/5 stars
                            <p>{review.text}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="dashboard-section support-messages">
                <h2>Messaggi di Supporto</h2>
                <ul>
                    {supportMessages.map(message => (
                        <li key={message.id}>
                            <strong>Da: {message.from}</strong>
                            <p>{message.message}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;