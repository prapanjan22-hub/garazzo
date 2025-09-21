import React, { useState, useEffect } from 'react';
import { api } from '../config/api';

const SearchPage = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getMechanics();
      setMechanics(response.data || []);
    } catch (err) {
      console.error('Error loading mechanics:', err);
      setError('Failed to load mechanics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (mechanicId) => {
    try {
      const bookingData = {
        userId: 1,
        mechanicId: mechanicId,
        vehicle: 'Honda City (KA-01-AB-1234)',
        service: 'General Service',
        serviceTime: '10:00 AM'
      };
      
      const response = await api.createBooking(bookingData);
      
      if (response.success) {
        alert('Booking created successfully!');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🔍 Finding Mechanics Near You...</h2>
        <p>Loading mechanics data from live backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={loadMechanics} style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🔍 Find Trusted Mechanics Near You
      </h2>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p>Found <strong>{mechanics.length}</strong> verified mechanics in your area</p>
      </div>

      {mechanics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No mechanics found. Please try again later.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px', 
          marginTop: '20px' 
        }}>
          {mechanics.map((mechanic) => (
            <div
              key={mechanic.id}
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: '15px',
                padding: '20px',
                backgroundColor: mechanic.available ? '#f8fff8' : '#fff8f8',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
            >
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  color: '#333', 
                  fontSize: '1.3em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {mechanic.name}
                  {mechanic.verified && <span style={{ color: 'green', fontSize: '1.1em' }}>✓</span>}
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  <p style={{ margin: '2px 0' }}>⭐ {mechanic.rating} ({mechanic.reviews} reviews)</p>
                  <p style={{ margin: '2px 0' }}>📍 {mechanic.distance} away</p>
                  <p style={{ margin: '2px 0' }}>📞 {mechanic.phone}</p>
                  <p style={{ margin: '2px 0' }}>💰 {mechanic.price}</p>
                </div>

                <p style={{ margin: '8px 0', fontSize: '13px', color: '#666' }}>
                  <strong>Location:</strong> {mechanic.location}
                </p>
                
                <p style={{ margin: '8px 0', fontSize: '13px', color: '#666' }}>
                  <strong>Hours:</strong> {mechanic.workingHours}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong style={{ fontSize: '14px' }}>Specializations:</strong>
                <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {mechanic.specialization.map((spec, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span
                  style={{
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: mechanic.available ? '#e8f5e8' : '#ffeaea',
                    color: mechanic.available ? '#2e7d2e' : '#d32f2f'
                  }}
                >
                  {mechanic.available ? '🟢 Available Now' : '🔴 Currently Busy'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleBooking(mechanic.id)}
                  disabled={!mechanic.available}
                  style={{
                    flex: '1',
                    padding: '12px 16px',
                    backgroundColor: mechanic.available ? '#4caf50' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: mechanic.available ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {mechanic.available ? '📅 Book Now' : '⏳ Not Available'}
                </button>
                
                <button
                  onClick={() => window.open(`tel:${mechanic.phone}`, '_self')}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  📞 Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
