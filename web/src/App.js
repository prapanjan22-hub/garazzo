import React, { useState, useEffect } from 'react';

function App() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const API_BASE = 'https://garazzo.onrender.com/api';

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/mechanics`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setMechanics(data.data || []);
    } catch (err) {
      console.error('Error loading mechanics:', err);
      setError('Failed to connect to backend services');
    } finally {
      setLoading(false);
    }
  };

  const activateEmergency = async () => {
    try {
      const response = await fetch(`${API_BASE}/emergency`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setEmergencyActive(true);
        // Show elegant notification instead of alert
        setTimeout(() => setEmergencyActive(false), 8000);
      }
    } catch (error) {
      console.error('Emergency error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading Garazzo Platform</h2>
          <p>Connecting to live services...</p>
        </div>
        
        <style>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-content {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 60px 40px;
            border-radius: 20px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-content h2 {
            margin: 0 0 10px 0;
            font-weight: 600;
            font-size: 1.8rem;
          }
          .loading-content p {
            margin: 0;
            opacity: 0.8;
            font-size: 1rem;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠</div>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={loadMechanics} className="retry-button">
            Retry Connection
          </button>
        </div>
        
        <style>{`
          .error-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .error-content {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 60px 40px;
            border-radius: 20px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            max-width: 400px;
          }
          .error-icon {
            font-size: 3rem;
            margin-bottom: 20px;
          }
          .error-content h2 {
            margin: 0 0 15px 0;
            font-weight: 600;
            font-size: 1.8rem;
          }
          .error-content p {
            margin: 0 0 30px 0;
            opacity: 0.9;
            line-height: 1.5;
          }
          .retry-button {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 12px 30px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .retry-button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Emergency Notification */}
      {emergencyActive && (
        <div className="emergency-notification">
          <div className="emergency-content">
            <div className="emergency-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
                <path d="M12 8v6M12 18h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="emergency-text">
              <h4>Emergency SOS Activated</h4>
              <p>Rescue team dispatched • ETA: 15-20 minutes</p>
            </div>
            <button onClick={() => setEmergencyActive(false)} className="emergency-close">×</button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
                <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="white"/>
                <path d="M16 12v8M12 16h8" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#667eea"/>
                    <stop offset="1" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="brand-text">Garazzo</span>
          </div>
          <div className="nav-status">
            <span className="status-indicator"></span>
            <span className="status-text">Live Platform</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Premium Car Service
              <span className="hero-highlight">Marketplace</span>
            </h1>
            <p className="hero-subtitle">
              Connect with verified mechanics and premium service providers across India. 
              Professional automotive care, delivered with excellence.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{mechanics.length}</span>
                <span className="stat-label">Verified Mechanics</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Emergency Support</span>
              </div>
              <div className="stat">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="emergency-section">
        <div className="container">
          <div className="emergency-card">
            <div className="emergency-info">
              <h3>Emergency Roadside Assistance</h3>
              <p>Professional help available 24/7 across major highways and cities</p>
            </div>
            <button onClick={activateEmergency} className="emergency-button">
              <span className="emergency-button-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
                </svg>
              </span>
              Activate Emergency SOS
            </button>
          </div>
        </div>
      </section>

      {/* Mechanics Section */}
      <section className="mechanics-section">
        <div className="container">
          <div className="section-header">
            <h2>Premium Service Providers</h2>
            <p>Handpicked mechanics with verified credentials and excellent track records</p>
          </div>

          <div className="mechanics-grid">
            {mechanics.map(mechanic => (
              <div key={mechanic.id} className="mechanic-card">
                <div className="mechanic-header">
                  <div className="mechanic-avatar">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect width="40" height="40" rx="20" fill="#f8f9fa"/>
                      <path d="M20 12c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" fill="#6c757d"/>
                    </svg>
                  </div>
                  <div className="mechanic-info">
                    <div className="mechanic-name-row">
                      <h4 className="mechanic-name">{mechanic.name}</h4>
                      {mechanic.verified && (
                        <div className="verified-badge">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 0l2.4 4.8L16 8l-5.6 3.2L8 16l-2.4-4.8L0 8l5.6-3.2L8 0z" fill="currentColor"/>
                          </svg>
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="mechanic-location">{mechanic.location}</p>
                  </div>
                </div>

                <div className="mechanic-metrics">
                  <div className="metric">
                    <span className="metric-value">{mechanic.rating}</span>
                    <span className="metric-label">Rating</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{mechanic.reviews}</span>
                    <span className="metric-label">Reviews</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{mechanic.distance || '2.5km'}</span>
                    <span className="metric-label">Distance</span>
                  </div>
                </div>

                <div className="mechanic-details">
                  <div className="detail-row">
                    <span className="detail-label">Specializations</span>
                    <div className="specializations">
                      {mechanic.specialization.slice(0, 2).map((spec, index) => (
                        <span key={index} className="specialization-tag">
                          {spec}
                        </span>
                      ))}
                      {mechanic.specialization.length > 2 && (
                        <span className="specialization-more">
                          +{mechanic.specialization.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Price Range</span>
                    <span className="detail-value">{mechanic.price}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Availability</span>
                    <div className="availability">
                      <span className={`availability-indicator ${mechanic.available ? 'available' : 'busy'}`}></span>
                      <span className="availability-text">
                        {mechanic.available ? 'Available Now' : 'Currently Busy'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mechanic-actions">
                  <button 
                    className={`action-button primary ${!mechanic.available ? 'disabled' : ''}`}
                    disabled={!mechanic.available}
                    onClick={() => {
                      // Elegant booking confirmation
                      const booking = document.createElement('div');
                      booking.innerHTML = `
                        <div style="position: fixed; top: 20px; right: 20px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 1000; max-width: 300px;">
                          <h4 style="margin: 0 0 10px 0; color: #28a745;">Booking Confirmed</h4>
                          <p style="margin: 0; color: #666; font-size: 14px;">Your request has been sent to ${mechanic.name}. They will contact you shortly.</p>
                        </div>
                      `;
                      document.body.appendChild(booking);
                      setTimeout(() => booking.remove(), 4000);
                    }}
                  >
                    <span className="button-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 6h12v8H2V6zM4 4V2h8v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                    {mechanic.available ? 'Book Service' : 'Currently Unavailable'}
                  </button>
                  <button 
                    className="action-button secondary"
                    onClick={() => window.open(`tel:${mechanic.phone}`, '_self')}
                  >
                    <span className="button-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3.5 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-9z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M6 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                    Call Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-icon">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="url(#footerGradient)"/>
                  <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="white"/>
                  <defs>
                    <linearGradient id="footerGradient" x1="0" y1="0" x2="32" y2="32">
                      <stop stopColor="#667eea"/>
                      <stop offset="1" stopColor="#764ba2"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h4>Garazzo Platform</h4>
                <p>Professional automotive service marketplace</p>
              </div>
            </div>
            <div className="footer-info">
              <div className="footer-item">
                <span className="footer-label">Backend Services</span>
                <span className="footer-value">garazzo.onrender.com</span>
              </div>
              <div className="footer-item">
                <span className="footer-label">Deployment</span>
                <span className="footer-value">Production Ready</span>
              </div>
              <div className="footer-item">
                <span className="footer-label">Status</span>
                <div className="status-row">
                  <span className="status-indicator active"></span>
                  <span className="footer-value">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: #fafbfc;
          min-height: 100vh;
          color: #2c3e50;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Emergency Notification */
        .emergency-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          animation: slideIn 0.5s ease;
        }

        .emergency-content {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 350px;
          backdrop-filter: blur(20px);
        }

        .emergency-icon {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .emergency-text h4 {
          margin: 0 0 5px 0;
          font-weight: 600;
        }

        .emergency-text p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .emergency-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .emergency-close:hover {
          opacity: 1;
          background: rgba(255,255,255,0.1);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Navigation */
        .navbar {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        .brand-text {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(40, 167, 69, 0.1);
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(40, 167, 69, 0.2);
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: #28a745;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-text {
          font-size: 13px;
          font-weight: 500;
          color: #28a745;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 100px 0;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
        }

        .hero-content {
          max-width: 600px;
          text-align: center;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 0 0 20px 0;
          line-height: 1.2;
        }

        .hero-highlight {
          display: block;
          background: rgba(255,255,255,0.2);
          padding: 5px 20px;
          border-radius: 50px;
          margin-top: 10px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin: 0 0 50px 0;
          line-height: 1.6;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 60px;
        }

        .stat {
          text-align: center;
          background: rgba(255,255,255,0.1);
          padding: 30px 20px;
          border-radius: 16px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Emergency Section */
        .emergency-section {
          padding: 80px 0;
        }

        .emergency-card {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          border-radius: 20px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          box-shadow: 0 20px 60px rgba(255, 107, 107, 0.3);
        }

        .emergency-info h3 {
          font-size: 1.5rem;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .emergency-info p {
          margin: 0;
          opacity: 0.9;
          font-size: 1rem;
        }

        .emergency-button {
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
          font-size: 16px;
        }

        .emergency-button:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .emergency-button-icon {
          width: 20px;
          height: 20px;
        }

        /* Mechanics Section */
        .mechanics-section {
          padding: 100px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin: 0 0 15px 0;
          font-weight: 700;
          color: #2c3e50;
        }

        .section-header p {
          font-size: 1.1rem;
          color: #6c757d;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .mechanics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
        }

        .mechanic-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .mechanic-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .mechanic-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .mechanic-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mechanic-info {
          flex: 1;
        }

        .mechanic-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }

        .mechanic-name {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .verified-badge {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .mechanic-location {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .mechanic-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 25px;
          padding: 20px 0;
          border-top: 1px solid #f1f3f4;
          border-bottom: 1px solid #f1f3f4;
        }

        .metric {
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 5px;
        }

        .metric-label {
          font-size: 0.8rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mechanic-details {
          margin-bottom: 30px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          font-weight: 500;
          color: #495057;
          font-size: 0.9rem;
        }

        .detail-value {
          color: #2c3e50;
          font-weight: 600;
        }

        .specializations {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .specialization-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .specialization-more {
          color: #6c757d;
          font-size: 11px;
          font-weight: 500;
        }

        .availability {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .availability-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .availability-indicator.available {
          background: #28a745;
        }

        .availability-indicator.busy {
          background: #dc3545;
        }

        .availability-text {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .mechanic-actions {
          display: flex;
          gap: 12px;
        }

        .action-button {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .action-button.primary {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .action-button.primary:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
        }

        .action-button.primary.disabled {
          background: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .action-button.secondary {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .action-button.secondary:hover {
          background: #e9ecef;
          transform: translateY(-2px);
        }

        .button-icon {
          width: 16px;
          height: 16px;
        }

        /* Footer */
        .footer {
          background: #2c3e50;
          color: white;
          padding: 60px 0;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .footer-brand h4 {
          margin: 0 0 5px 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .footer-brand p {
          margin: 0;
          opacity: 0.7;
          font-size: 0.9rem;
        }

        .footer-info {
          display: flex;
          gap: 40px;
        }

        .footer-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .footer-label {
          font-size: 0.8rem;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-value {
          font-weight: 500;
        }

        .status-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-indicator.active {
          width: 8px;
          height: 8px;
          background: #28a745;
          border-radius: 50%;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .emergency-card {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .mechanics-grid {
            grid-template-columns: 1fr;
          }

          .footer-content {
            flex-direction: column;
            gap: 30px;
            text-align: center;
          }

          .footer-info {
            flex-direction: column;
            gap: 20px;
            align-items: center;
          }

          .nav-container {
            padding: 0 15px;
          }

          .container {
            padding: 0 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
