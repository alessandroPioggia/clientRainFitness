import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import SupportPage from './components/SupportPage';
import SchedeSearchPage from './components/SchedeSearchPage';
import CreateSchedaPage from './components/CreateSchedaPage';
import ProfilePage from './components/ProfilePage';
import ChatPage from './components/ChatPage';
import SchedaDetailPage from "./components/SchedaDetailPage";
import { getSessionData, clearSessionCookies } from './utils/cookieUtils';
import api from './utils/api';
import CookieConsent from './components/CookieConsent';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentPageParams, setCurrentPageParams] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleNavigate = useCallback((page, params = null) => {
    const protectedPages = ['search', 'profile', 'chat', 'create-scheda', 'scheda-detail'];

    if (protectedPages.includes(page) && !isLoggedIn) {
      setError('Devi accedere per visualizzare questa pagina');
      setCurrentPage('login');
      return;
    }

    setCurrentPage(page);
    setCurrentPageParams(params);
    setError('');
  }, [isLoggedIn]);

  const handleLogout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    } finally {
      clearSessionCookies();
      setUser(null);
      setIsLoggedIn(false);
      handleNavigate('home');
    }
  }, [handleNavigate]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const sessionData = getSessionData();
      if (sessionData.sessionId) {
        const response = await api.get('/api/auth/check-session');
        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
          setUser({
            id: response.data.userId,
            userType: response.data.userType
          });
        } else {
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Errore nella verifica della sessione:', error);
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleRegister = async (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    handleNavigate('home');
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    handleNavigate('home');
  };

  const renderPage = () => {
    const commonProps = {
      onNavigate: handleNavigate,
      isLoggedIn,
      user,
      error
    };

    switch (currentPage) {
      case 'home':
        return <HomePage {...commonProps} />;
      case 'register':
        return <RegistrationPage onNavigate={handleNavigate} onRegister={handleRegister} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} error={error} />;
      case 'support':
        return <SupportPage onNavigate={handleNavigate} />;
      case 'search':
        return isLoggedIn ?
            <SchedeSearchPage {...commonProps} /> :
            <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} error={error} />;
      case 'create-scheda':
        return isLoggedIn ?
            <CreateSchedaPage {...commonProps} /> :
            <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} error={error} />;
      case 'scheda-detail':
        return isLoggedIn ?
            <SchedaDetailPage
                {...commonProps}
                schedaId={currentPageParams?.schedaId}
            /> :
            <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} error={error} />;
      case 'profile':
        return isLoggedIn ?
            <ProfilePage {...commonProps} /> :
            <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} error={error} />;
      case 'chat':
        return isLoggedIn ?
            <ChatPage {...commonProps} /> :
            <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} error={error} />;
      case 'logout':
        handleLogout();
        return <HomePage {...commonProps} />;
      default:
        return <div>Pagina in costruzione</div>;
    }
  };

  return (
      <div className="app">
        {error && <div className="error-message">{error}</div>}
        {renderPage()}
        <CookieConsent />
      </div>
  );
};

export default App;