// src/components/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import AdminSidebar from './AdminSidebar';
import AdminHome from './AdminHome';
import AllBookings from './AllBookings';
import ManageSlots from './ManageSlots';
import AllUsers from './AllUsers';
import SearchVehicle from './SearchVehicle';

import './Admin.css';

const AdminDashboard = ({ user, onLogout }) => {
  const location = useLocation();

  // Sidebar open/close state with persistence
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('adminSidebar');
    return stored !== 'closed'; // default open
  });

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('adminSidebar', sidebarOpen ? 'open' : 'closed');
  }, [sidebarOpen]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div
        className={`dashboard-content ${
          sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
        }`}
      >
        {/* Route animation / wrapper */}
        <div key={location.pathname} className="route-animate">
          <Routes>
            {/* Default route */}
            <Route index element={<Navigate to="home" replace />} />

            {/* Admin pages */}
            <Route path="home" element={<AdminHome user={user} />} />
            <Route path="all-bookings" element={<AllBookings user={user} />} />
            <Route path="manage-slots" element={<ManageSlots user={user} />} />
            <Route path="all-users" element={<AllUsers user={user} />} />
            <Route path="search" element={<SearchVehicle user={user} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;