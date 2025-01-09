import React from 'react';
import ReviewDashboard from './ReviewDashboard';
import ReviewDashboard2 from './ReviewDashboard2';
import TrainerReviews from './TrainerReviews';
import AdminDashboard from './AdminDashboard';


const HomePage = ({ onNavigate, isLoggedIn, user }) => {
    const handleNavClick = (page, event) => {
        event.preventDefault(); // Previene comportamenti indesiderati
        event.stopPropagation(); // Ferma la propagazione dell'evento
        onNavigate(page);
    };

    return (
        <div className="home-page">
            <header>
                <div className="logo">RAIN FITNESS</div>
                <nav className="main-nav">
                    {isLoggedIn ? (
                        // Menu per utenti loggati
                        <>
                            <button
                                onClick={(e) => handleNavClick('search', e)}
                                className="nav-button"
                            >
                                Schede
                            </button>
                            <button
                                onClick={(e) => handleNavClick('profile', e)}
                                className="nav-button"
                            >
                                Profilo
                            </button>
                            <button
                                onClick={(e) => handleNavClick('chat', e)}
                                className="nav-button"
                            >
                                Chat
                            </button>
                            <button
                                onClick={(e) => handleNavClick('support', e)}
                                className="nav-button"
                            >
                                Supporto
                            </button>
                            <button
                                onClick={(e) => handleNavClick('logout', e)}
                                className="nav-button logout"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // Menu per utenti non loggati
                        <>
                            <button
                                onClick={(e) => handleNavClick('support', e)}
                                className="nav-button"
                            >
                                Supporto
                            </button>
                            <button
                                onClick={(e) => handleNavClick('login', e)}
                                className="nav-button login"
                            >
                                Accedi
                            </button>
                        </>
                    )}
                </nav>
            </header>
            <main>
                <h1>Se vuoi qualcosa che non hai mai avuto, devi fare qualcosa che non hai mai fatto.</h1>
                <p>Adesso, scegli come allenarti.</p>
                {!isLoggedIn && (
                    <button
                        className="cta-button"
                        onClick={(e) => handleNavClick('register', e)}
                    >
                        Iscriviti
                    </button>
                )}
                {isLoggedIn && (
                    <p>Benvenuto, {user.username}!</p>
                )}
                {!isLoggedIn && (
                    <>
                        <ReviewDashboard />
                        <ReviewDashboard2 />
                    </>
                )}
                {isLoggedIn && user.userType === 'trainer' && (
                    <TrainerReviews trainerUsername={user.username} />
                )}
                {isLoggedIn && user.userType === 'admin' && (
                    <AdminDashboard />
                )}

            </main>
        </div>
    );
};

export default HomePage;