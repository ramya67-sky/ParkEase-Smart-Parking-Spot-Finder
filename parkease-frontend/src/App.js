import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import UserDashboard from "./components/User/UserDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";

import { authService } from "./services/auth";
import LoadingScreen from "./components/Common/LoadingScreen";
import AuthGuard from "./components/Common/AuthGuard";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user on app start
  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();

      if (user && isAuth) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Auth load failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ After login/register
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // ✅ Logout
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // ✅ Role based redirect
  const redirectToDashboard = () => {
    if (!currentUser) return "/login";
    return currentUser.role === "ADMIN" ? "/admin" : "/user";
  };

  if (loading) return <LoadingScreen message="Loading..." />;

  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to={redirectToDashboard()} />
            )
          }
        />

        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register onRegister={handleLogin} />
            ) : (
              <Navigate to={redirectToDashboard()} />
            )
          }
        />

        {/* ================= USER ROUTE ================= */}

        <Route
          path="/user/*"
          element={
            <AuthGuard user={currentUser} allowedRoles={["USER"]}>
              <UserDashboard user={currentUser} onLogout={handleLogout} />
            </AuthGuard>
          }
        />

        {/* ================= ADMIN ROUTE ================= */}

        <Route
          path="/admin/*"
          element={
            <AuthGuard user={currentUser} allowedRoles={["ADMIN"]}>
              <AdminDashboard user={currentUser} onLogout={handleLogout} />
            </AuthGuard>
          }
        />

        {/* ================= DEFAULT ================= */}

        {/* First page */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;