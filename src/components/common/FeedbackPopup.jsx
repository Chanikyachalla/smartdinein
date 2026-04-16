import React, { useState } from 'react';
import { MessageSquarePlus, X, Send, ChevronDown } from 'lucide-react';
import './FeedbackPopup.css';


export function FeedbackPopup({ facilityId, facilityName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    studentName: '',
    rollNumber: '',
    reviewText: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reviewText.trim()) return;

    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: `general-${facilityId}`,
          targetType: 'general',
          targetName: facilityName || 'General',
          facilityId,
          reviewText: form.reviewText,
          studentName: form.studentName || 'Anonymous',
          rollNumber: form.rollNumber || ''
        })
      });
      setSubmitted(true);
      setForm({ studentName: '', rollNumber: '', reviewText: '' });
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-popup-container">
      {/* Trigger Button */}
      {!isOpen && (
        <button className="feedback-fab" onClick={() => setIsOpen(true)}>
          <MessageSquarePlus size={20} />
          <span>Give Feedback</span>
        </button>
      )}

      {/* Popup Window */}
      {isOpen && (
        <div className={`feedback-popup ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="feedback-popup-header" onClick={() => isMinimized && setIsMinimized(false)}>
            <span className="popup-title">
              <MessageSquarePlus size={16} />
              Share Your Feedback
            </span>
            <div className="popup-controls">
              <button className="popup-ctrl-btn" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} title={isMinimized ? 'Expand' : 'Minimize'}>
                <ChevronDown size={16} style={{ transform: isMinimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <button className="popup-ctrl-btn" onClick={() => { setIsOpen(false); setIsMinimized(false); }} title="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <div className="feedback-popup-body">
              {submitted ? (
                <div className="feedback-thanks">
                  <span>âœ…</span>
                  <p>Thank you for your feedback!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="studentName"
                    placeholder="Your name (optional)"
                    value={form.studentName}
                    onChange={handleChange}
                    className="popup-input"
                  />
                  <input
                    type="text"
                    name="rollNumber"
                    placeholder="Roll number (optional)"
                    value={form.rollNumber}
                    onChange={handleChange}
                    className="popup-input"
                  />
                  <textarea
                    name="reviewText"
                    placeholder="Share your thoughts about the food, service, or anything else..."
                    value={form.reviewText}
                    onChange={handleChange}
                    className="popup-textarea"
                    rows={4}
                    required
                  />
                  <div className="popup-footer">
                    <span className="popup-hint">Name & Roll No. are optional</span>
                    <button type="submit" className="popup-send-btn" disabled={loading || !form.reviewText.trim()}>
                      {loading ? 'Sending...' : <><Send size={14} /> Send</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


