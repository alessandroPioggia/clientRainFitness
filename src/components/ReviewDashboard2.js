import React from "react";
import {simulatedReviews2} from "../data/reviews";

const ReviewDashboard2 = () => {
    return (
        <div className="review-dashboard">
            <div className="review-slider">
                {simulatedReviews2.map(review => (
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

export default ReviewDashboard2;