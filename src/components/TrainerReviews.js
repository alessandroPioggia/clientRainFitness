import React from "react";

const TrainerReviews = ({ trainerUsername }) => {
    // Questo è un esempio di recensioni specifiche per un trainer
    // In un'applicazione reale, queste verrebbero caricate da un database
    const trainerReviews = [
        { id: 1, author: "Marco S.", rating: 5, text: `${trainerUsername} è un ottimo personal trainer!` },
        { id: 2, author: "Giulia R.", rating: 4, text: `Ho fatto grandi progressi con ${trainerUsername}.` },
        { id: 3, author: "Gennaro B.", rating: 1, text: `${trainerUsername} non sa proprio relazionarsi con i suoi clienti.` },
        { id: 4, author: "Giulia R.", rating: 4, text: `Ho fatto grandi progressi con ${trainerUsername}.` },
        { id: 5, author: "Luca B.", rating: 5, text: `${trainerUsername} sa davvero come motivare i suoi clienti.` }
    ];

    return (
        <div className="review-dashboard">
            <h2>Recensioni per {trainerUsername}</h2>
            <div className="review-slider">
                {trainerReviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <span className="review-author">{review.author}</span>
                            <span className="review-rating">
                {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                ))}
              </span>
                        </div>
                        <p className="review-text">{review.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainerReviews;