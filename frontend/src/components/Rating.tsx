import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import api from '../lib/api';

interface RatingProps {
  videoId: string;
  initialRating?: number;
  onRate?: (rating: number) => void;
}

export default function Rating({ videoId, initialRating = 0, onRate }: RatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRate = async (value: number) => {
    setSubmitting(true);
    try {
      await api.post(`/videos/${videoId}/rate`, { rating: value });
      setRating(value);
      if (onRate) onRate(value);
    } catch (error) {
      console.error('Failed to rate:', error);
    } finally {
      setSubmitting(false);
    }
  };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            disabled={submitting}
            className="transition-all transform hover:scale-125 disabled:opacity-50"
          >
            <FiStar
              size={24}
              className={`${
                star <= (hover || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-400">({rating}/5)</span>
        )}
      </div>
    );
  }
