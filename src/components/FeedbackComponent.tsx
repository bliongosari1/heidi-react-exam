import React, { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import './FeedbackComponent.css';

interface FeedbackComponentProps {
  onClose?: () => void;
  onSubmit?: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  easeOfUseRating: number;
  usefulnessRating: number;
  comment: string;
}

export function FeedbackComponent({ onClose, onSubmit }: FeedbackComponentProps) {
  const isMobile = useIsMobile();
  const [easeOfUseRating, setEaseOfUseRating] = useState(5);
  const [usefulnessRating, setUsefulnessRating] = useState(4);
  const [comment, setComment] = useState('');

  if (isMobile) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit?.({
      easeOfUseRating,
      usefulnessRating,
      comment,
    });
  };

  const renderStars = (rating: number, setRating: (rating: number) => void) => {
    return (
      <div className="feedback-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`feedback-star ${star <= rating ? 'active' : ''}`}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-container">
        <button
          type="button"
          className="feedback-close"
          onClick={onClose}
          aria-label="Close feedback"
        >
          ×
        </button>

        <h2 className="feedback-title">
          Vos commentaires nous aident à nous améliorer
        </h2>

        <div className="feedback-question">
          <p>Avez-vous trouvé Références facile à utiliser ?</p>
          {renderStars(easeOfUseRating, setEaseOfUseRating)}
        </div>

        <div className="feedback-question">
          <p>Avez-vous trouvé la fonctionnalité Références utile ?</p>
          {renderStars(usefulnessRating, setUsefulnessRating)}
        </div>

        <div className="feedback-comment">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez vos commentaires..."
            rows={4}
          />
        </div>

        <div className="feedback-actions">
          <button
            type="button"
            className="feedback-submit"
            onClick={handleSubmit}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
