// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserDashboard from './components/User/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import { authService } from './services/auth';
import LoadingScreen from './components/Common/LoadingScreen';
import AuthGuard from './components/Common/AuthGuard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Helper to redirect based on role
  const redirectToDashboard = () =>
    currentUser?.userType === 'ADMIN' ? '/admin' : '/user';

  if (loading) return <LoadingScreen message="Loading..." />;

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={redirectToDashboard()} />
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register onRegister={handleLogin} /> : <Navigate to={redirectToDashboard()} />
            }
          />

          {/* Protected Routes - User */}
          <Route
            path="/user/*"
            element={
              <AuthGuard user={currentUser} allowedRoles={['CUSTOMER']}>
                <UserDashboard user={currentUser} onLogout={handleLogout} />
              </AuthGuard>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/*"
            element={
              <AuthGuard user={currentUser} allowedRoles={['ADMIN']}>
                <AdminDashboard user={currentUser} onLogout={handleLogout} />
              </AuthGuard>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to={redirectToDashboard()} /> : <Navigate to="/login" />
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;