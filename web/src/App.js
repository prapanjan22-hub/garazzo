import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import SOSFormPage from './pages/SOSFormPage';
import SOSConfirmationPage from './pages/SOSConfirmationPage';
import RepairHistoryPage from './pages/RepairHistoryPage';
import CommunitiesPage from './pages/CommunitiesPage';
import FAQPage from './pages/FAQPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        
        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/sos-form" element={
          <ProtectedRoute>
            <SOSFormPage />
          </ProtectedRoute>
        } />
        
        <Route path="/sos-confirmation" element={
          <ProtectedRoute>
            <SOSConfirmationPage />
          </ProtectedRoute>
        } />
        
        <Route path="/repair-history" element={
          <ProtectedRoute>
            <RepairHistoryPage />
          </ProtectedRoute>
        } />
        
        <Route path="/communities" element={
          <ProtectedRoute>
            <CommunitiesPage />
          </ProtectedRoute>
        } />
        
        <Route path="/faq" element={
          <ProtectedRoute>
            <FAQPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
