import React, { useState } from 'react';
import { api } from '../config/api';

const EmergencyPage = () => {
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);

  const activateEmergency = async () => {
    try {
      setLoading(true);
      
      const response = await api.getEmergency();
      
      if (response.success) {
        setEmergency(response.data);
        setActivated(true);
      }
    } catch (error) {
      console.error('Emergency activation failed:', error);
      alert('Failed to activate emergency service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#d32f2f', marginBottom: '10px', fontSize: '2.5em' }}>🚨 Emergency SOS</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          24/7 Roadside Assistance for Your Vehicle
        </p>
      </div>

      {!activated ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            backgroundColor: '#ffebee',
            border: '3px solid #f44336',
            borderRadius: '15px',
            padding: '40px 30px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>Need Immediate Help?</h2>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '15px', color: '#333', textAlign: 'center' }}>
                <strong>Our emergency response team provides:</strong>
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px',
                fontSize: '14px'
              }}>
                <div>🔋 Battery Jump Start</div>
                <div>🛞 Flat Tire Assistance</div>
                <div>🌡️ Engine Overheating</div>
                <div>⛽ Emergency Fuel Delivery</div>
                <div>🚛 Emergency Towing</div>
                <div>🔧 Basic Roadside Repairs</div>
              </div>
            </div>

            <button
              onClick={activateEmergency}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 8px rgba(244, 67, 54, 0.3)',
                transform: loading ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? '🔄 Connecting...' : '🚨 ACTIVATE SOS'}
            </button>
            
            <p style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginTop: '15px',
              fontStyle: 'italic'
            }}>
              Connected to live backend at garazzo.onrender.com
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#e8f5e8',
          border: '3px solid #4caf50',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#2e7d2e', marginBottom: '15px' }}>✅ SOS Activated Successfully!</h2>
          
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#f44336',
            marginBottom: '20px'
          }}>
            🚗 Help is on the way!
          </div>

          {emergency && (
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '15px'
              }}>
                <h3 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>
                  🚗 Rescue Team Information
                </h3>
                <p><strong>Team:</strong> {emergency.rescueTeam}</p>
                <p><strong>Phone:</strong> {emergency.phone}</p>
                <p><strong>ETA:</strong> {emergency.estimatedTime}</p>
                <p><strong>Status:</strong> <span style={{ 
                  color: '#4caf50', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>{emergency.status}</span></p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <button
                  onClick={() => window.open(`tel:${emergency.phone}`, '_self')}
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '15px 30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 3px 6px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  📞 Call Rescue Team Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmergencyPage;
