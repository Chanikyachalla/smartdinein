import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Flame } from 'lucide-react';
import { CanteenCard } from '../../components/common/CanteenCard';
import { Badge } from '../../components/common/Badge';
import { FeedbackPopup } from '../../components/common/FeedbackPopup';
import { OrderPopup } from '../../components/common/OrderPopup';
import './CanteenView.css';


export function CanteenView() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingsMap, setRatingsMap] = useState({});

  useEffect(() => {
    // fetch canteen facility first, then its items
    fetch(`${process.env.API_URL}/api/facilities`)
      .then(res => res.json())
      .then(data => {
        const canteen = data.find(f => f.type === 'canteen');
        if (canteen) {
          setFacility(canteen);
          return fetch(`${process.env.API_URL}/api/facilities/${canteen._id}/menu`);
        }
        throw new Error('No canteen found');
      })
      .then(res => {
        if (!res.ok) throw new Error('No menu');
        return res.json();
      })
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Fetch analytics for rating map (no auth needed, but we'll try)
  useEffect(() => {
    if (!facility) return;
    fetch(`${process.env.API_URL}/api/facilities/${facility._id}/analytics`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const map = {};
        (data || []).forEach(stat => { map[stat.targetId] = stat.averageRating; });
        setRatingsMap(map);
      })
      .catch(() => { });
  }, [facility]);

  // Derive categories dynamically
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (a.availability === 'soldOut' && b.availability !== 'soldOut') return 1;
      if (b.availability === 'soldOut' && a.availability !== 'soldOut') return -1;
      return 0;
    });
  }, [searchTerm, selectedCategory, items]);

  const trendingItems = useMemo(() => {
    return items.filter(item => item.popular && item.availability !== 'soldOut').slice(0, 3);
  }, [items]);

  return (
    <div className="canteen-view">
      <header className="page-header sticky-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-title">
          <h1>Canteen Menu</h1>
          <p>Live inventory &amp; trending items</p>
        </div>
      </header>

      <div className="status-banner" style={{ margin: '1rem', marginBottom: '2rem' }}>
        <div className="status-info">
          <span>Current Crowd Level:</span>
        </div>
        <Badge type="crowd" status={facility?.crowdLevel || 'low'} />
      </div>

      <main className="canteen-content">
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading canteen items...
          </div>
        ) : (
          <>
            {!searchTerm && selectedCategory === 'all' && trendingItems.length > 0 && (
              <section className="trending-section">
                <h2 className="section-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Flame size={24} color="#dc2626" /> Trending Today</h2>
                <div className="canteen-grid">
                  {trendingItems.map(item => (
                    <CanteenCard key={item._id || item.id} item={{ ...item, facilityId: facility?._id, avgRating: ratingsMap[item._id] }} />
                  ))}
                </div>
              </section>
            )}

            <section className="all-items-section">
              <h2 className="section-title">
                {searchTerm || selectedCategory !== 'all' ? 'Search Results' : 'All Items'}
                <span className="results-count">({filteredItems.length})</span>
              </h2>

              {filteredItems.length > 0 ? (
                <div className="canteen-grid">
                  {filteredItems.map(item => (
                    <CanteenCard key={`all-${item._id || item.id}`} item={{ ...item, facilityId: facility?._id, avgRating: ratingsMap[item._id] }} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No items found matching your filters.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Gmail-style feedback popup - fixed bottom right */}
      {facility && (
        <FeedbackPopup
          facilityId={facility._id}
          facilityName={facility.name}
        />
      )}

      {/* Order popup - fixed above feedback */}
      {facility && (
        <OrderPopup
          facilityId={facility._id}
          menuItems={items}
        />
      )}
    </div>
  );
}


