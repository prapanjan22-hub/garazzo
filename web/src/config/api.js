const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://garazzo.onrender.com/api';

console.log('🔧 API Configuration:', { baseURL: API_BASE_URL });

export const api = {
  baseURL: API_BASE_URL,
  
  // Get all mechanics
  getMechanics: async () => {
    try {
      console.log('🌐 Fetching mechanics from:', `${API_BASE_URL}/mechanics`);
      const response = await fetch(`${API_BASE_URL}/mechanics`);
      const data = await response.json();
      console.log('✅ Mechanics data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching mechanics:', error);
      throw error;
    }
  },
  
  // Get all bookings
  getBookings: async () => {
    try {
      console.log('🌐 Fetching bookings from:', `${API_BASE_URL}/bookings`);
      const response = await fetch(`${API_BASE_URL}/bookings`);
      const data = await response.json();
      console.log('✅ Bookings data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      throw error;
    }
  },
  
  // Create new booking
  createBooking: async (bookingData) => {
    try {
      console.log('🌐 Creating booking:', bookingData);
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      const data = await response.json();
      console.log('✅ Booking created:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      throw error;
    }
  },
  
  // Get emergency SOS
  getEmergency: async () => {
    try {
      console.log('🌐 Activating emergency SOS:', `${API_BASE_URL}/emergency`);
      const response = await fetch(`${API_BASE_URL}/emergency`);
      const data = await response.json();
      console.log('✅ Emergency response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error activating emergency:', error);
      throw error;
    }
  },
  
  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(API_BASE_URL.replace('/api', ''));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  }
};

export default api;
