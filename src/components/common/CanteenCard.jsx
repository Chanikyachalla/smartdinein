import React, { useState } from 'react';
import { Badge } from './Badge';
import { Star } from 'lucide-react';
import './CanteenCard.css';


export function CanteenCard({ item }) {
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const handleFeedback = async (rating) => {
    if (item.availability === 'soldOut' || ratingSubmitted) return;
    
    setRatingSubmitted(true);
    try {
        await fetch(`${process.env.API_URL}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetId: item._id || item.id,
                targetType: 'item',
                targetName: item.name,
                facilityId: item.facilityId,
                rating: rating
            })
        });
    } catch(err) {
        console.error(err);
    }
  };

  const isSoldOut = item.availability === 'soldOut';

  return (
    <div className={`card canteen-card ${isSoldOut ? 'sold-out' : ''}`}>
      <div className="card-image-container">
        <img 
          src={item.imageUrl || 'https://via.placeholder.com/150'} 
          alt={item.name} 
          className="card-image"
          loading="lazy"
        />
        <div className="badge-overlay">
          <Badge type="availability" status={item.availability} />
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{item.name}</h3>
          <span className="card-price">â‚¹{item.price}</span>
        </div>
        
        <div className="card-tags">
          {item.dietaryTags.map(tag => (
            <span key={tag} className={`dietary-tag ${tag}`}>
              {tag === 'veg' ? 'ðŸŸ¢ Veg' : tag === 'non-veg' ? 'ðŸ”´ Non-Veg' : tag}
            </span>
          ))}
          <span className="category-tag">{item.category}</span>
          {item.popular && <span className="popular-tag">ðŸ”¥ Trending</span>}
          {item.avgRating && (
            <span className="category-tag" style={{ background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' }}>
              â­ {item.avgRating}
            </span>
          )}
        </div>

        <div className="feedback-section">
          {ratingSubmitted ? (
            <span style={{ fontSize: '0.875rem', color: 'var(--success-color)', fontWeight: 500, textAlign: 'center', display: 'block', padding: '0.5rem 0' }}>
               Thank you for the feedback!
            </span>
          ) : (
            <>
              <span className="feedback-label">Rate this item:</span>
              <div className="star-row" style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    style={{ background: 'transparent', border: 'none', cursor: isSoldOut ? 'not-allowed' : 'pointer', padding: '2px', color: (hoveredStar >= star) ? '#fbbf24' : '#d1d5db' }}
                    onClick={() => handleFeedback(star)}
                    onMouseEnter={() => !isSoldOut && setHoveredStar(star)}
                    onMouseLeave={() => !isSoldOut && setHoveredStar(0)}
                    disabled={isSoldOut}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star size={20} fill={hoveredStar >= star ? '#fbbf24' : 'none'} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


