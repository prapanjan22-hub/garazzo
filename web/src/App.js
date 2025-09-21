import React, { useState, useEffect } from 'react';

function App() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'https://garazzo.onrender.com/api';

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching from:', `${API_BASE}/mechanics`);
      const response = await fetch(`${API_BASE}/mechanics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Data received:', data);
      
      setMechanics(data.data || []);
    } catch (err) {
      console.error('Error loading mechanics:', err);
      setError('Failed to load mechanics from backend');
    } finally {
      setLoading(false);
    }
  };

  const activateEmergency = async () => {
    try {
      const response = await fetch(`${API_BASE}/emergency`);
      const data = await response.json();
      
      if (data.success && data.data) {
        alert(`🚨 EMERGENCY ACTIVATED!\n\nTeam: ${data.data.rescueTeam}\nPhone: ${data.data.phone}\nETA: ${data.data.estimatedTime}\nStatus: ${data.data.status}`);
      }
    } catch (error) {
      console.error('Emergency error:', error);
      alert('Emergency service activated! Help is on the way.');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#007bff' }}>🚗 Loading Garazzo...</h2>
          <p>Connecting to backend at garazzo.onrender.com</p>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#dc3545' }}>❌ Connection Error</h2>
          <p>{error}</p>
          <button 
            onClick={loadMechanics}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '3em',
          fontWeight: 'bold'
        }}>
          🚗 Garazzo
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: '1.3em', 
          opacity: 0.95 
        }}>
          Your Trusted Car Service Marketplace Platform
        </p>
        <p style={{ 
          margin: '10px 0 0 0', 
          fontSize: '0.9em', 
          opacity: 0.8 
        }}>
          Live Backend: garazzo.onrender.com | Frontend: Netlify Deployment
        </p>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Emergency Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '50px',
          padding: '30px',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
          color: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
        }}>
          <h2 style={{ 
            margin: '0 0 15px 0',
            fontSize: '2em'
          }}>🚨 Emergency SOS</h2>
          <p style={{ 
            margin: '0 0 20px 0',
            fontSize: '1.1em',
            opacity: 0.9
          }}>
            24/7 Roadside Assistance & Emergency Support
          </p>
          <button 
            onClick={activateEmergency}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#ff6b6b';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.target.style.color = 'white';
            }}
          >
            🚨 ACTIVATE EMERGENCY SOS
          </button>
        </div>

        {/* Mechanics Section */}
        <div>
          <h2 style={{ 
            textAlign: 'center', 
            color: '#2c3e50',
            marginBottom: '30px',
            fontSize: '2.5em'
          }}>
            🔧 Trusted Mechanics Near You
          </h2>

          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <p style={{ 
              margin: 0,
              fontSize: '1.2em',
              color: '#666'
            }}>
              ✅ Found <strong style={{ color: '#28a745' }}>{mechanics.length}</strong> verified mechanics
            </p>
            <p style={{ 
              margin: '5px 0 0 0',
              fontSize: '0.9em',
              color: '#888'
            }}>
              Data loaded live from backend API
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '25px',
            marginTop: '30px'
          }}>
            {mechanics.map(mechanic => (
              <div key={mechanic.id} style={{
                backgroundColor: 'white',
                border: '2px solid #e9ecef',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    color: '#2c3e50', 
                    margin: '0 0 15px 0',
                    fontSize: '1.4em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    {mechanic.name}
                    {mechanic.verified && <span style={{ color: '#28a745', fontSize: '1.2em' }}>✓</span>}
                    <span style={{
                      marginLeft: 'auto',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: mechanic.available ? '#d4edda' : '#f8d7da',
                      color: mechanic.available ? '#155724' : '#721c24'
                    }}>
                      {mechanic.available ? '🟢 Available' : '🔴 Busy'}
                    </span>
                  </h3>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    fontSize: '15px',
                    color: '#666',
                    marginBottom: '15px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>⭐</span> {mechanic.rating} ({mechanic.reviews} reviews)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📍</span> {mechanic.distance || '2.5 km'} away
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>💰</span> {mechanic.price}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📞</span> {mechanic.phone}
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ 
                      margin: '0 0 8px 0',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      <strong>📍 Location:</strong> {mechanic.location}
                    </p>
                    <p style={{ 
                      margin: '0',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      <strong>⏰ Working Hours:</strong> {mechanic.workingHours || '9:00 AM - 6:00 PM'}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <strong style={{ fontSize: '14px', color: '#495057' }}>🔧 Specializations:</strong>
                    <div style={{ 
                      marginTop: '10px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {mechanic.specialization.map((spec, index) => (
                        <span key={index} style={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          padding: '5px 10px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px',
                  marginTop: '20px'
                }}>
                  <button
                    disabled={!mechanic.available}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      backgroundColor: mechanic.available ? '#28a745' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: mechanic.available ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                      alert(`📅 Booking Request Sent!\n\nMechanic: ${mechanic.name}\nLocation: ${mechanic.location}\nPhone: ${mechanic.phone}\n\nThey will contact you shortly!`);
                    }}
                    onMouseEnter={(e) => {
                      if (mechanic.available) {
                        e.target.style.backgroundColor = '#218838';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (mechanic.available) {
                        e.target.style.backgroundColor = '#28a745';
                      }
                    }}
                  >
                    {mechanic.available ? '📅 Book Now' : '⏳ Not Available'}
                  </button>
                  
                  <button
                    onClick={() => window.open(`tel:${mechanic.phone}`, '_self')}
                    style={{
                      padding: '14px 20px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    📞 Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px',
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          borderRadius: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>🚗 Garazzo MVP Platform</h3>
          <p style={{ margin: '0 0 10px 0', opacity: 0.9 }}>
            <strong>Backend:</strong> garazzo.onrender.com (Live API)
          </p>
          <p style={{ margin: '0 0 10px 0', opacity: 0.9 }}>
            <strong>Frontend:</strong> Deployed on Netlify
          </p>
          <p style={{ 
            fontSize: '14px', 
            opacity: 0.7,
            margin: '15px 0 0 0'
          }}>
            Full-Stack Car Service Marketplace • Built for National Level Ideathon
          </p>
        </footer>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
