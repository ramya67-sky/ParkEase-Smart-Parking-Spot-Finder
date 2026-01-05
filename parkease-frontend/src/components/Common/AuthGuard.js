// src/components/Common/AuthGuard.js
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AuthGuard
 * - Protects routes based on authentication & role
 * - Supports single or multiple allowed roles
 *
 * Usage:
 * <AuthGuard user={user} allowedRoles={['ADMIN']}>
 *    <AdminDashboard />
 * </AuthGuard>
 */
const AuthGuard = ({ children, user, allowedRoles = [] }) => {
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // No role restriction → allow
  if (allowedRoles.length === 0) {
    return children;
  }

  // Role check
  const hasAccess = allowedRoles.includes(user.userType);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;