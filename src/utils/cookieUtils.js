import Cookies from 'js-cookie';

export const setCookieWithExpiry = (name, value, days = 7) => {
    Cookies.set(name, value, {
        expires: days,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
};

export const getCookie = (name) => {
    return Cookies.get(name);
};

export const removeCookie = (name) => {
    Cookies.remove(name);
};

export const setSessionCookie = (sessionData) => {
    setCookieWithExpiry('sessionId', sessionData.sessionId);
    setCookieWithExpiry('userId', sessionData.userId);
    setCookieWithExpiry('userType', sessionData.userType);
};

export const clearSessionCookies = () => {
    removeCookie('sessionId');
    removeCookie('userId');
    removeCookie('userType');
};

export const getSessionData = () => {
    return {
        sessionId: getCookie('sessionId'),
        userId: getCookie('userId'),
        userType: getCookie('userType')
    };
};