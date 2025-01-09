import React, {useEffect, useState} from "react";
import { challenges } from '../data/challenges';
import { badges } from '../data/badges';

const GamificationComponent = ({ user }) => {
    const [userBadges, setUserBadges] = useState([]);
    const [activeChallenges, setActiveChallenges] = useState([]);
    const [userLevel, setUserLevel] = useState(1);
    const [userXP, setUserXP] = useState(0);

    useEffect(() => {
        // Simula il caricamento dei dati dell'utente
        // In un'applicazione reale, questi dati verrebbero caricati dal backend
        setUserBadges([1, 2]); // L'utente ha i badge 1 e 2
        setActiveChallenges([1, 3]); // L'utente ha le sfide 1 e 3 attive
        setUserLevel(3);
        setUserXP(250);
    }, []);

    const xpToNextLevel = userLevel * 100; // Esempio: ogni livello richiede 100 XP in più del precedente

    const renderBadges = () => {
        if (!badges || !Array.isArray(badges)) {
            return <p>Nessun badge disponibile</p>;
        }

        return (
            <div className="badges-grid">
                {badges.map(badge => (
                    <div
                        key={badge.id}
                        className={`badge ${userBadges.includes(badge.id) ? 'earned' : 'locked'}`}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            padding: '15px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        <span
                            className="badge-icon"
                            style={{ fontSize: '2em', marginBottom: '10px', display: 'block' }}
                        >
                            {badge.icon}
                        </span>
                        <h4 style={{ margin: '10px 0', color: userBadges.includes(badge.id) ? '#fff' : '#aaa' }}>
                            {badge.name}
                        </h4>
                        <p style={{ fontSize: '0.9em', color: userBadges.includes(badge.id) ? '#fff' : '#aaa' }}>
                            {badge.description}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    const renderChallenges = () => {
        if (!challenges || !Array.isArray(challenges)) {
            return <p>Nessuna sfida disponibile</p>;
        }

        const activeChallengesData = challenges.filter(challenge =>
            activeChallenges.includes(challenge.id)
        );

        return (
            <ul className="challenges-list" style={{ listStyle: 'none', padding: 0 }}>
                {activeChallengesData.map(challenge => (
                    <li
                        key={challenge.id}
                        className="challenge-item"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '10px'
                        }}
                    >
                        <h4 style={{ margin: '0 0 10px 0' }}>{challenge.name}</h4>
                        <p style={{ margin: '5px 0' }}>{challenge.description}</p>
                        <p style={{ margin: '5px 0', color: '#FFD700' }}>
                            Ricompensa: {challenge.reward} XP
                        </p>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="gamification-container">
            <div className="user-level">
                <h3>Livello {userLevel}</h3>
                <div
                    className="xp-bar"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        height: '20px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        margin: '10px 0'
                    }}
                >
                    <div
                        className="xp-progress"
                        style={{
                            width: `${Math.min((userXP / xpToNextLevel) * 100, 100)}%`,
                            backgroundColor: '#800000',
                            height: '100%',
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>
                <p>{userXP} / {xpToNextLevel} XP per il prossimo livello</p>
            </div>

            <div className="badges-section" style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>I Tuoi Badge</h3>
                {renderBadges()}
            </div>

            <div className="challenges-section" style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Sfide Attive</h3>
                {renderChallenges()}
            </div>
        </div>
    );
};

export default GamificationComponent;