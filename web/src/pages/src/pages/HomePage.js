import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);

  const API_BASE = 'https://garazzo.onrender.com/api';

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    try {
      const response = await fetch(`${API_BASE}/mechanics`);
      const data = await response.json();
      setMechanics(data.data || []);
    } catch (error) {
      console.error('Error loading mechanics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMechanics = mechanics.filter(mechanic =>
    mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mechanic.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mechanic.specialization.some(spec => 
      spec.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSOSClick = () => {
    navigate('/sos-form');
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#sidebarGradient)"/>
                <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="white"/>
                <defs>
                  <linearGradient id="sidebarGradient" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#667eea"/>
                    <stop offset="1" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>SOS Car Repair</span>
          </div>
          <button 
            className="sidebar-toggle mobile-only"
            onClick={() => setSidebarOpen(false)}
          >×</button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="nav-title">Main</h4>
            <a href="#" className="nav-item active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Dashboard
            </a>
            <a href="#" className="nav-item" onClick={() => navigate('/repair-history')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Vehicle Repair History
            </a>
            <a href="#" className="nav-item" onClick={() => navigate('/communities')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Communities
            </a>
          </div>

          <div className="nav-section">
            <h4 className="nav-title">Support</h4>
            <a href="#" className="nav-item" onClick={() => navigate('/faq')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              FAQ
            </a>
            <a href="#" className="nav-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Support Chat
            </a>
            <a href="#" className="nav-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Rate App
            </a>
          </div>

          <div className="nav-section">
            <h4 className="nav-title">Account</h4>
            <a href="#" className="nav-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Profile Settings
            </a>
            <a href="#" className="nav-item" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="search-container">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search mechanics, services, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="top-bar-right">
            <button className="sos-button" onClick={handleSOSClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
              </svg>
              Emergency SOS
            </button>

            <div className="user-menu">
              <div className="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Map and Mechanics View */}
        <div className="content-grid">
          {/* Map Section */}
          <div className="map-section">
            <div className="map-container">
              <div className="map-placeholder">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <h3>Interactive Map View</h3>
                <p>Mechanics locations displayed here</p>
                
                {/* Map Markers */}
                <div className="map-markers">
                  {filteredMechanics.slice(0, 3).map((mechanic, index) => (
                    <div 
                      key={mechanic.id} 
                      className={`map-marker marker-${index + 1}`}
                      onClick={() => setSelectedMechanic(mechanic)}
                    >
                      <div className="marker-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="marker-info">
                        <div className="marker-name">{mechanic.name}</div>
                        <div className="marker-rating">★ {mechanic.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {selectedMechanic && (
              <div className="map-popup">
                <div className="popup-header">
                  <h4>{selectedMechanic.name}</h4>
                  <button onClick={() => setSelectedMechanic(null)}>×</button>
                </div>
                <div className="popup-content">
                  <p>★ {selectedMechanic.rating} • {selectedMechanic.location}</p>
                  <p className="popup-price">{selectedMechanic.price}</p>
                  <button className="popup-cta">View Details</button>
                </div>
              </div>
            )}
          </div>

          {/* Mechanics List */}
          <div className="mechanics-list">
            <div className="list-header">
              <h3>Available Mechanics ({filteredMechanics.length})</h3>
              <div className="filter-buttons">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Available</button>
                <button className="filter-btn">Nearby</button>
              </div>
            </div>

            <div className="mechanics-grid">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading mechanics...</p>
                </div>
              ) : (
                filteredMechanics.map(mechanic => (
                  <div key={mechanic.id} className="mechanic-card">
                    <div className="card-header">
                      <div className="mechanic-info">
                        <h4>{mechanic.name}</h4>
                        <div className="mechanic-meta">
                          <span className="rating">★ {mechanic.rating}</span>
                          <span className="reviews">({mechanic.reviews} reviews)</span>
                          <span className="distance">{mechanic.distance || '2.5km'}</span>
                        </div>
                      </div>
                      <div className={`availability ${mechanic.available ? 'available' : 'busy'}`}>
                        <span className="status-dot"></span>
                        {mechanic.available ? 'Available' : 'Busy'}
                      </div>
                    </div>

                    <div className="card-content">
                      <p className="location">{mechanic.location}</p>
                      <div className="specializations">
                        {mechanic.specialization.slice(0, 2).map((spec, index) => (
                          <span key={index} className="spec-tag">{spec}</span>
                        ))}
                      </div>
                      <div className="price-range">{mechanic.price}</div>
                    </div>

                    <div className="card-actions">
                      <button className="action-btn secondary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Call
                      </button>
                      <button 
                        className={`action-btn primary ${!mechanic.available ? 'disabled' : ''}`}
                        disabled={!mechanic.available}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .home-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e2e8f0;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 25px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand span {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a202c;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          color: #64748b;
          transition: all 0.2s;
        }

        .sidebar-toggle:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .mobile-only {
          display: none;
        }

        .sidebar-nav {
          padding: 20px;
        }

        .nav-section {
          margin-bottom: 30px;
        }

        .nav-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 15px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          border-radius: 10px;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 4px;
          cursor: pointer;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #334155;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .nav-item.active:hover {
          background: linear-gradient(135deg, #5a6fd8, #6a4190);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 0;
          transition: margin-left 0.3s ease;
        }

        .top-bar {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .search-container {
          position: relative;
          max-width: 400px;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .sos-button {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .sos-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-avatar:hover {
          background: #e2e8f0;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 25px;
          padding: 25px;
          height: calc(100vh - 81px);
          overflow: hidden;
        }

        /* Map Section */
        .map-section {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          border: 1px solid #e2e8f0;
        }

        .map-container {
          height: 100%;
          position: relative;
        }

        .map-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #64748b;
          position: relative;
        }

        .map-placeholder svg {
          margin-bottom: 20px;
        }

        .map-placeholder h3 {
          margin: 0 0 10px 0;
          font-size: 1.5rem;
          color: #334155;
        }

        .map-markers {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .map-marker {
          position: absolute;
          cursor: pointer;
          transition: all 0.2s;
        }

        .map-marker.marker-1 {
          top: 20%;
          left: 30%;
        }

        .map-marker.marker-2 {
          top: 60%;
          right: 25%;
        }

        .map-marker.marker-3 {
          bottom: 25%;
          left: 60%;
        }

        .marker-icon {
          width: 40px;
          height: 40px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          position: relative;
        }

        .marker-icon::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid #ef4444;
        }

        .marker-info {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .map-marker:hover .marker-info {
          opacity: 1;
        }

        .marker-name {
          font-weight: 600;
          font-size: 0.8rem;
          color: #334155;
        }

        .marker-rating {
          font-size: 0.7rem;
          color: #64748b;
        }

        .map-popup {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .popup-header h4 {
          margin: 0;
          color: #334155;
        }

        .popup-header button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #64748b;
        }

        .popup-content {
          padding: 15px 20px;
        }

        .popup-price {
          font-weight: 600;
          color: #059669;
          margin: 8px 0;
        }

        .popup-cta {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        /* Mechanics List */
        .mechanics-list {
          background: white;
          border-radius: 15px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .list-header {
          padding: 20px 25px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .list-header h3 {
          margin: 0;
          color: #334155;
          font-size: 1.1rem;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          background: none;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .mechanics-grid {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #64748b;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .mechanic-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          transition: all 0.2s;
        }

        .mechanic-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .mechanic-info h4 {
          margin: 0 0 8px 0;
          color: #334155;
          font-size: 1.1rem;
        }

        .mechanic-meta {
          display: flex;
          gap: 12px;
          font-size: 0.85rem;
          color: #64748b;
        }

        .rating {
          color: #f59e0b;
          font-weight: 600;
        }

        .availability {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .availability.available {
          color: #059669;
        }

        .availability.busy {
          color: #dc2626;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }

        .card-content {
          margin-bottom: 20px;
        }

        .location {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0 0 12px 0;
        }

        .specializations {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .spec-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .price-range {
          font-weight: 600;
          color: #059669;
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          transition: all 0.2s;
          flex: 1;
          justify-content: center;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          border: none;
        }

        .action-btn.primary:hover:not(.disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }

        .action-btn.primary.disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .action-btn.secondary {
          background: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .action-btn.secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Responsive Design */
        @media (min-width: 1024px) {
          .sidebar {
            position: static;
            transform: translateX(0);
          }

          .main-content {
            margin-left: 280px;
          }
        }

        @media (max-width: 1023px) {
          .mobile-only {
            display: block;
          }

          .content-grid {
            grid-template-columns: 1fr;
            grid-template-rows: 300px 1fr;
          }

          .mechanics-list {
            max-height: none;
          }
        }

        @media (max-width: 768px) {
          .top-bar {
            padding: 15px 20px;
          }

          .content-grid {
            padding: 15px;
          }

          .search-container {
            max-width: none;
          }

          .top-bar-right {
            gap: 10px;
          }

          .sos-button {
            padding: 10px 16px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
