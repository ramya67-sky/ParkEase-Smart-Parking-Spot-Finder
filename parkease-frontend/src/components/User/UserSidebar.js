import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaClock,
  FaParking,
  FaEye,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser
} from 'react-icons/fa';
import './User.css';

const UserSidebar = ({ user, isOpen, onToggle, onLogout }) => {
  const fullName = user?.fullName || 'User';

  return (
    <>
      {/* Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar user-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaParking />
            {isOpen && <span>Smart Parking</span>}
          </div>

          {isOpen && (
            <div className="sidebar-user">
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-info">
                <div className="user-name">{fullName}</div>
                <div className="user-role">Customer</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavLink
            to="/user/my-bookings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title={!isOpen ? 'My Bookings' : ''}
          >
            <FaClock />
            {isOpen && <span>My Bookings</span>}
          </NavLink>

          <NavLink
            to="/user/park-vehicle"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title={!isOpen ? 'Park Vehicle' : ''}
          >
            <FaParking />
            {isOpen && <span>Park Vehicle</span>}
          </NavLink>

          <NavLink
            to="/user/view-slots"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title={!isOpen ? 'View Slots' : ''}
          >
            <FaEye />
            {isOpen && <span>View Slots</span>}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-link logout-btn"
            onClick={onLogout}
            title={!isOpen ? 'Logout' : ''}
          >
            <FaSignOutAlt />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;