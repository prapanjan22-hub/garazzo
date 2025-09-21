import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const SOSConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {};
  
  const [trackingStatus, setTrackingStatus] = useState('dispatching');
  const [eta, setEta] = useState(18);

  useEffect(() => {
    // Simulate status updates
    const timer = setTimeout(() => {
      setTrackingStatus('assigned');
    }, 3000);

    const etaTimer = setInterval(() => {
      setEta(prev => prev > 0 ? prev - 1 : 0);
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(etaTimer);
    };
  }, []);

  if (!formData) {
    navigate('/home');
    return null;
  }

  return (
    <div className="sos-confirmation-container">
      <div className="confirmation-header">
        <div className="success-animation">
          <div className="check-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <h1>Emergency Request Sent!</h1>
        <p>Help is on the way. Stay calm and in a safe location.</p>
      </div>

      <div className="tracking-card">
        <div className="status-header">
          <div className="status-indicator">
            <div className={`status-dot ${trackingStatus}`}></div>
            <span className="status-text">
              {trackingStatus === 'dispatching' ? 'Finding Nearest Mechanic...' : 'Mechanic Assigned & En Route'}
            </span>
          </div>
          <div className="eta-display">
            <span className="eta-number">{eta}</span>
            <span className="eta-label">min ETA</span>
          </div>
        </div>

        <div className="mechanic-info">
          <div className="mechanic-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="mechanic-details">
            <h3>Emergency Response Team</h3>
            <p>Specialized in roadside assistance</p>
            <div className="contact-actions">
              <button className="contact-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Call Mechanic
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="request-summary">
        <h3>Request Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Vehicle</span>
            <span className="value">{formData.vehicleBrand} {formData.vehicleModel}</span>
          </div>
          <div className="summary-item">
            <span className="label">Issue</span>
            <span className="value">{formData.issueDescription}</span>
          </div>
          <div className="summary-item">
            <span className="label">Location</span>
            <span className="value">{formData.location}</span>
          </div>
          <div className="summary-item">
            <span className="label">Priority</span>
            <span className={`value priority-${formData.urgencyLevel}`}>
              {formData.urgencyLevel.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-button secondary" onClick={() => navigate('/home')}>
          Back to Dashboard
        </button>
        <button className="action-button primary">
          Track Live Location
        </button>
      </div>

      <style>{`
        .sos-confirmation-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .confirmation-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .success-animation {
          margin-bottom: 30px;
        }

        .check-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .confirmation-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #065f46;
          margin: 0 0 10px 0;
        }

        .confirmation-header p {
          color: #047857;
          font-size: 1.1rem;
        }

        .tracking-card,
        .request-summary {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin: 0 auto 25px;
          max-width: 600px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.dispatching {
          background: #f59e0b;
        }

        .status-dot.assigned {
          background: #10b981;
        }

        .status-text {
          font-weight: 600;
          color: #374151;
        }

        .eta-display {
          text-align: center;
        }

        .eta-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #10b981;
        }

        .eta-label {
          font-size: 0.8rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mechanic-info {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .mechanic-avatar {
          width: 60px;
          height: 60px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .mechanic-details h3 {
          margin: 0 0 5px 0;
          color: #374151;
        }

        .mechanic-details p {
          margin: 0 0 15px 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .contact-button {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .contact-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .request-summary h3 {
          margin: 0 0 20px 0;
          color: #374151;
          font-size: 1.2rem;
        }

        .summary-grid {
          display: grid;
          gap: 15px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f9fafb;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 500;
          color: #6b7280;
        }

        .value {
          font-weight: 600;
          color: #374151;
          text-align: right;
        }

        .priority-critical { color: #dc2626; }
        .priority-high { color: #ea580c; }
        .priority-medium { color: #ca8a04; }
        .priority-low { color: #16a34a; }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .action-button {
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
          flex: 1;
          max-width: 200px;
        }

        .action-button.secondary {
          background: white;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .action-button.secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .action-button.primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
        }

        .action-button.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .sos-confirmation-container {
            padding: 20px 15px;
          }

          .tracking-card,
          .request-summary {
            padding: 20px;
          }

          .status-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-button {
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SOSConfirmationPage;

