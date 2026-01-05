import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaClipboardList,
  FaParking,
  FaUsers,
  FaSearch,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';
import './Admin.css';

const AdminSidebar = ({ user, isOpen, onToggle, onLogout }) => {
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-toggle admin-toggle"
        onClick={onToggle}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
        
        {/* Header */}
        <div className="sidebar-header admin-header">
          <div className="sidebar-logo admin-logo">
            <FaParking />
            {isOpen && <span>ParkEase Admin</span>}
          </div>

          {isOpen && (
            <div className="sidebar-user admin-user">
              <div className="user-avatar admin-avatar">
                <FaShieldAlt />
              </div>
              <div className="user-info">
                <div className="user-name">
                  {user?.fullName || 'Admin'}
                </div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav admin-nav">
          <NavLink to="all-bookings" className="sidebar-link">
            <FaClipboardList />
            {isOpen && <span>All Bookings</span>}
          </NavLink>

          <NavLink to="manage-slots" className="sidebar-link">
            <FaParking />
            {isOpen && <span>Manage Slots</span>}
          </NavLink>

          <NavLink to="all-users" className="sidebar-link">
            <FaUsers />
            {isOpen && <span>All Users</span>}
          </NavLink>

          <NavLink to="search" className="sidebar-link">
            <FaSearch />
            {isOpen && <span>Search Vehicle</span>}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer admin-footer">
          <button
            className="sidebar-link logout-btn"
            onClick={onLogout}
          >
            <FaSignOutAlt />
            {isOpen && <span>Logout</span>}
          </button>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
