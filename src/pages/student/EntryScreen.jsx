import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Coffee } from 'lucide-react';
import './EntryScreen.css';

export function EntryScreen() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="entry-container">
      <header className="entry-header">
        <h1 className="inst-name">Smart Campus Dining</h1>
        <p className="current-date">{currentDate}</p>
      </header>
      
      <main className="entry-options">
        <button 
          className="option-card mess-option"
          onClick={() => navigate('/mess')}
        >
          <Utensils size={48} className="option-icon" />
          <h2>Mess</h2>
          <p>Daily menus and crowd levels</p>
        </button>
        
        <button 
          className="option-card canteen-option"
          onClick={() => navigate('/canteen')}
        >
          <Coffee size={48} className="option-icon" />
          <h2>Canteen</h2>
          <p>Live inventory and trending items</p>
        </button>
      </main>
      
      <footer className="entry-footer">
        <button className="vendor-link" onClick={() => navigate('/vendor')}>
          Vendor Login
        </button>
      </footer>
    </div>
  );
}
