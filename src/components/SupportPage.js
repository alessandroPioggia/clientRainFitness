import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

const SupportPage = ({ onNavigate }) => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('message', (message) => {
                setChatMessages(prev => [...prev, message]);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            // Aggiungi il messaggio dell'utente alla chat
            setChatMessages(prev => [...prev, {
                text: message,
                from: 'user',
                timestamp: new Date().toISOString()
            }]);

            // Invia il messaggio al server
            socket.emit('sendMessage', message);
            setMessage('');
        }
    };

    return (
        <div className="support-page">
            <h2>Supporto Rain Fitness</h2>

            <div className="virtual-assistant-chat">
                <div className="chat-messages" ref={chatContainerRef}>
                    {chatMessages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.from === 'user' ? 'user-message' : 'assistant-message'}`}
                        >
                            <p>{msg.text}</p>
                            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="chat-input-form">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Scrivi un messaggio..."
                    />
                    <button type="submit">Invia</button>
                </form>
            </div>

            <div className="contact-info">
                <h3>Altri contatti</h3>
                <p>Email: support@rainfitness.com</p>
                <p>Telefono: +39 123 456 7890</p>
                <p>Indirizzo: Via del Fitness, 123 - 00100 Roma</p>
            </div>

            <button onClick={() => onNavigate('home')}>Torna alla Home</button>
        </div>
    );
};

export default SupportPage;