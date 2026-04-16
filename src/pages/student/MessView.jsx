import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Info } from 'lucide-react';
import { MessSlotCard } from '../../components/common/MessSlotCard';
import { Badge } from '../../components/common/Badge';
import { FeedbackPopup } from '../../components/common/FeedbackPopup';
import './MessView.css';


export function MessView() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [todaysMenu, setTodaysMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch facilities initially
  useEffect(() => {
    fetch(`${process.env.API_URL}/api/facilities`)
      .then(res => res.json())
      .then(data => {
        const messes = data.filter(f => f.type === 'mess');
        setFacilities(messes);
        if (messes.length > 0) {
          setSelectedFacilityId(messes[0]._id);
        }
      })
      .catch(err => {
        console.error("Failed to fetch facilities", err);
      });
  }, []);

  // Fetch menu when facility selected
  useEffect(() => {
    if (!selectedFacilityId) return;

    setLoading(true);
    fetch(`${process.env.API_URL}/api/facilities/${selectedFacilityId}/menu`)
      .then(res => {
        if (!res.ok) throw new Error('Menu not found');
        return res.json();
      })
      .then(data => {
        // data should be the MessMenu object
        setTodaysMenu(data);
        setLoading(false);
      })
      .catch(err => {
        setTodaysMenu(null);
        setLoading(false);
      });
  }, [selectedFacilityId]);

  const activeFacility = facilities.find(f => f._id === selectedFacilityId);

  return (
    <div className="mess-view">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-title">
          <h1>Mess Menu</h1>
          <p>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        </div>
      </header>

      <div className="facility-selector">
        {facilities.map(f => (
          <button
            key={f._id}
            className={`tab-btn ${selectedFacilityId === f._id ? 'active' : ''}`}
            onClick={() => setSelectedFacilityId(f._id)}
          >
            {f.name}
          </button>
        ))}
      </div>

      {activeFacility && (
        <div className="status-banner">
          <div className="status-info">
            <Info size={18} className="info-icon" />
            <span>Current Crowd Level:</span>
          </div>
          <Badge type="crowd" status={activeFacility.crowdLevel || 'low'} />
        </div>
      )}

      <main className="menu-container">
        {loading ? (
          <div className="empty-state">
            <p>Loading menu...</p>
          </div>
        ) : todaysMenu ? (
          <div className="slots-grid">
            <MessSlotCard
              slotName="Breakfast"
              time={todaysMenu.breakfast?.time || 'Morning'}
              items={todaysMenu.breakfast?.items || []}
              facilityId={activeFacility._id}
              menuId={todaysMenu._id}
            />
            <MessSlotCard
              slotName="Lunch"
              time={todaysMenu.lunch?.time || 'Afternoon'}
              items={todaysMenu.lunch?.items || []}
              facilityId={activeFacility._id}
              menuId={todaysMenu._id}
            />
            <MessSlotCard
              slotName="Dinner"
              time={todaysMenu.dinner?.time || 'Evening'}
              items={todaysMenu.dinner?.items || []}
              facilityId={activeFacility._id}
              menuId={todaysMenu._id}
            />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-container">
              <Clock size={48} className="empty-icon" />
            </div>
            <h2>Menu Not Posted Yet</h2>
            <p>The vendor has not uploaded today's menu. Please check back later.</p>
          </div>
        )}
      </main>

      {/* Gmail-style feedback popup â€” fixed bottom right */}
      {activeFacility && (
        <FeedbackPopup
          facilityId={activeFacility._id}
          facilityName={activeFacility.name}
        />
      )}
    </div>
  );
}


