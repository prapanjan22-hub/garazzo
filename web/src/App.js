import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { store, persistor } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import VehiclesPage from './pages/VehiclesPage';
import EmergencyPage from './pages/EmergencyPage';
import CommunityPage from './pages/CommunityPage';
import AdminPage from './pages/AdminPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
      light: '#66b3ff',
      dark: '#0056b3',
    },
    secondary: {
      main: '#6c757d',
      light: '#9ca3af',
      dark: '#4b5563',
    },
    success: {
      main: '#28a745',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#dc3545',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <SocketProvider>
              <Router>
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/search" element={
                      <ProtectedRoute>
                        <SearchPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/bookings" element={
                      <ProtectedRoute>
                        <BookingsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/vehicles" element={
                      <ProtectedRoute>
                        <VehiclesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/emergency" element={
                      <ProtectedRoute>
                        <EmergencyPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/community" element={
                      <ProtectedRoute>
                        <CommunityPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminPage />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </Layout>
              </Router>
              <Toaster position="top-right" />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
