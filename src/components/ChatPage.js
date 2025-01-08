import React, { useEffect, useState, useRef } from "react";
import api from '../utils/api';

const ChatPage = ({ onNavigate, user }) => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeTab, setActiveTab] = useState('chat');
    const [trainers, setTrainers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (activeTab === 'search') {
            searchTrainers('', '');
        }
    }, [activeTab]);

    useEffect(() => {
        loadContacts();
    }, []);

    useEffect(() => {
        if (selectedContact) {
            loadMessages(selectedContact._id);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadContacts = async () => {
        try {
            const response = await api.get('/api/chat/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error('Errore nel caricamento dei contatti:', error);
        }
    };

    const loadMessages = async (contactId) => {
        try {
            const response = await api.get(`/api/chat/messages/${contactId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Errore nel caricamento dei messaggi:', error);
        }
    };

    const handleContactSelect = async (contact) => {
        setSelectedContact(contact);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const response = await api.post('/api/chat/messages', {
                receiverId: selectedContact._id,
                content: newMessage.trim()
            });
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Errore nell\'invio del messaggio:', error);
        }
    };

    const searchTrainers = async (query, specialty) => {
        try {
            const response = await api.get('/api/chat/trainers', {
                params: {
                    search: query,
                    specialty: specialty
                }
            });
            setTrainers(response.data);
        } catch (error) {
            console.error('Errore nella ricerca dei trainer:', error);
        }
    };

    const handleTrainerSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        searchTrainers(query, specialtyFilter);
    };

    const handleSpecialtyChange = (e) => {
        const specialty = e.target.value;
        setSpecialtyFilter(specialty);
        searchTrainers(searchQuery, specialty);
    };

    const handleTrainerSelect = async (trainer) => {
        try {
            // Aggiungi il trainer ai contatti
            await api.post('/api/chat/contacts/add', { contactId: trainer._id });

            // Aggiorna la lista dei contatti
            await loadContacts();

            // Seleziona il trainer per la chat
            setSelectedContact(trainer);
            setActiveTab('chat');
        } catch (error) {
            console.error('Errore nell\'aggiunta del contatto:', error);
        }
    };


    return (
        <div className="chat-page">
            <header className="fixed-header">
                <div className="logo">RAIN FITNESS</div>
                <nav>
                    <button onClick={() => onNavigate('home')}>Home</button>
                    <button onClick={() => onNavigate('search')}>Schede</button>
                    <button onClick={() => onNavigate('profile')}>Profilo</button>
                    <button className="active">Chat</button>
                    <button onClick={() => onNavigate('support')}>Supporto</button>
                </nav>
            </header>

            <div className="chat-tabs">
                <button
                    className={activeTab === 'chat' ? 'active' : ''}
                    onClick={() => setActiveTab('chat')}
                >
                    Chat
                </button>
                <button
                    className={activeTab === 'search' ? 'active' : ''}
                    onClick={() => setActiveTab('search')}
                >
                    Cerca Trainer
                </button>
            </div>

            {activeTab === 'chat' ? (
                <div className="chat-container">
                    <div className="contacts-list">
                        <h3>Contatti</h3>
                        <ul>
                            {contacts.map((contact) => (
                                <li
                                    key={contact._id}
                                    onClick={() => handleContactSelect(contact)}
                                    className={`contact-item ${selectedContact?._id === contact._id ? 'active' : ''}`}
                                >
                                    <div className="contact-photo">
                                        {contact.photo ? (
                                            <img src={contact.photo} alt={contact.username} />
                                        ) : (
                                            <div className="default-avatar">{contact.username[0].toUpperCase()}</div>
                                        )}
                                    </div>
                                    <div className="contact-info">
                                        <span className="contact-name">{contact.username}</span>
                                        <span className="contact-type">{contact.userType}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="chat-window">
                        {selectedContact ? (
                            <>
                                <div className="chat-header">
                                    <h3>Chat con {selectedContact.username}</h3>
                                </div>
                                <div className="messages-container">
                                    {messages.map((message) => {
                                        const isMessageSent = message.sender._id === user._id;
                                        return (
                                            <div
                                                key={message._id}
                                                className={`message-wrapper ${isMessageSent ? 'sent' : 'received'}`}
                                            >
                                                <div className="message">
                                                    <div className="message-content">
                                                        {message.content}
                                                    </div>
                                                    <span className="timestamp">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef}/>
                                </div>
                                <form onSubmit={handleSendMessage} className="message-form">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Scrivi un messaggio..."
                                    />
                                    <button type="submit">Invia</button>
                                </form>
                            </>
                        ) : (
                            <div className="no-chat-selected">
                                Seleziona un contatto per iniziare una chat
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="trainer-search-container">
                    <div className="search-filters">
                        <input
                            type="text"
                            placeholder="Cerca per nome..."
                            value={searchQuery}
                            onChange={handleTrainerSearch}
                            className="search-input"
                        />
                        <select
                            value={specialtyFilter}
                            onChange={handleSpecialtyChange}
                            className="specialty-filter"
                        >
                            <option value="">Tutte le specialità</option>
                            <option value="bodybuilding">Bodybuilding</option>
                            <option value="powerlifting">Powerlifting</option>
                            <option value="fitness">Fitness</option>
                            <option value="calisthenics">Calisthenics</option>
                            <option value="weightloss">Perdita Peso</option>
                        </select>
                    </div>

                    <div className="trainers-grid">
                        {trainers.map(trainer => (
                            <div key={trainer._id} className="trainer-card">
                                <div className="trainer-photo">
                                    {trainer.photo ? (
                                        <img src={trainer.photo} alt={trainer.username} />
                                    ) : (
                                        <div className="default-avatar">{trainer.username[0].toUpperCase()}</div>
                                    )}
                                </div>
                                <div className="trainer-info">
                                    <h3>{trainer.username}</h3>
                                    <div className="specialties">
                                        {trainer.specialties?.map(specialty => (
                                            <span key={specialty} className="specialty-tag">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="trainer-bio">{trainer.bio}</p>
                                    <button
                                        className="contact-button"
                                        onClick={() => handleTrainerSelect(trainer)}
                                    >
                                        Contatta
                                    </button>
                                </div>
                            </div>
                        ))}
                        {trainers.length === 0 && (
                            <div className="no-results">
                                Nessun trainer trovato
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;