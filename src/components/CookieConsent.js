import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(true);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent) {
            setShowConsent(false);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookieConsent', 'all');
        setShowConsent(false);
    };

    const handleAcceptEssential = () => {
        localStorage.setItem('cookieConsent', 'essential');
        setShowConsent(false);
    };

    if (!showConsent) return null;

    return (
        <div className="cookie-consent" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            zIndex: 1000
        }}>
            <h2>Impostazioni Privacy</h2>
            <p>Utilizziamo i cookie per offrirti la migliore esperienza su Rain Fitness.
                Alcuni cookie sono essenziali per il funzionamento del sito, mentre altri ci aiutano a migliorare i nostri servizi.</p>

            <div style={{ marginTop: '20px' }}>
                <h3>Cookie Essenziali</h3>
                <p>Necessari per il corretto funzionamento della piattaforma. Non possono essere disattivati.</p>

                <h3>Cookie Analitici e Marketing</h3>
                <p>Ci permettono di migliorare i nostri servizi e personalizzare la tua esperienza di allenamento.</p>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleAcceptEssential}
                    style={{
                        marginRight: '10px',
                        padding: '10px 20px',
                        background: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Accetta Solo Essenziali
                </button>
                <button
                    onClick={handleAcceptAll}
                    style={{
                        padding: '10px 20px',
                        background: '#800000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Accetta Tutti
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;