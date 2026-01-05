 import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import MyBookings from './MyBookings';
import ParkVehicle from './ParkVehicle';
import ViewSlots from './ViewSlots';
import './User.css';

const UserDashboard = ({ user, onLogout }) => {
  const location = useLocation();

  // Sidebar open/close state with persistence
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('userSidebar');
    return stored !== 'closed';
  });

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(
      'userSidebar',
      sidebarOpen ? 'open' : 'closed'
    );
  }, [sidebarOpen]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <UserSidebar
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
        {/* Route animation wrapper */}
        <div key={location.pathname} className="route-animate">
          <Routes>
            {/* Default route */}
            <Route index element={<Navigate to="my-bookings" replace />} />

            {/* User pages */}
            <Route
              path="my-bookings"
              element={<MyBookings user={user} />}
            />
            <Route
              path="park-vehicle"
              element={<ParkVehicle user={user} />}
            />
            <Route
              path="view-slots"
              element={<ViewSlots />}
            />

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to="my-bookings" replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;