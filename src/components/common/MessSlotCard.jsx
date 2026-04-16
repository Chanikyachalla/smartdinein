import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './MessSlotCard.css';


export function MessSlotCard({ slotName, time, items, facilityId, menuId }) {
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleFeedback = async (rating) => {
    if (ratingSubmitted) return;
    
    setRatingSubmitted(true);
    
    const targetId = `slot-${menuId}-${slotName.toLowerCase()}`;

    try {
        await fetch('http://localhost:5000/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetId: targetId,
                targetType: 'slot',
                targetName: slotName,
                facilityId: facilityId,
                rating: rating
            })
        });
    } catch(err) {
        console.error(err);
    }
  };

  const getSlotIcon = () => {
    switch(slotName.toLowerCase()) {
      case 'breakfast': return 'ðŸŒ…';
      case 'lunch': return 'â˜€ï¸';
      case 'dinner': return 'ðŸŒ™';
      default: return 'ðŸ²';
    }
  };

  return (
    <div className="card mess-slot-card">
      <div className="slot-header">
        <div className="slot-title-area">
          <span className="slot-icon">{getSlotIcon()}</span>
          <h2 className="slot-name">{slotName}</h2>
        </div>
        <span className="slot-time">{time}</span>
      </div>
      
      <div className="slot-body">
        <ul className="item-list">
          {items.map(item => {
            return (
              <li key={item._id || item.id} className="menu-item">
                <div className="item-name-row">
                  <span className="item-name">{item.name}</span>
                  {item.dietaryTags?.map(tag => (
                     <span key={tag} className={`dot-indicator ${tag}`} title={tag}></span>
                  ))}
                </div>
                {item.description && <p className="item-description">{item.description}</p>}
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="slot-footer">
        {ratingSubmitted ? (
             <span style={{ fontSize: '0.875rem', color: 'var(--success-color)', fontWeight: 500, textAlign: 'center', width: '100%', display: 'inline-block' }}>
                Thank you for the feedback!
             </span>
        ) : (
          <>
            <span className="feedback-label">How was this meal overall?</span>
            <div className="star-row-compact" style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: (hoveredStar >= star) ? '#fbbf24' : '#d1d5db' }}
                  onClick={() => handleFeedback(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star size={24} fill={hoveredStar >= star ? '#fbbf24' : 'none'} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


