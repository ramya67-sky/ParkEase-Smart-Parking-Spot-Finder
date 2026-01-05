 import React, { useState, useEffect, useMemo } from 'react';
import { FaUsers, FaUserShield, FaUser, FaSearch, FaSyncAlt } from 'react-icons/fa';
import api from '../../services/api';
import { AUTH_API } from '../../utils/constants';
import Notification from '../Common/Notification';
import './Admin.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  /* ================= Fetch Users ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${AUTH_API}/users`);
      if (response.data?.success) {
        setUsers(response.data.users || []);
      } else {
        showNotification('Unable to load users', 'error');
      }
    } catch (err) {
      showNotification('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ================= Notification ================= */
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /* ================= Stats ================= */
  const stats = useMemo(() => {
    const admins = users.filter(u => u.userType === 'ADMIN').length;
    const customers = users.filter(u => u.userType === 'CUSTOMER').length;
    return {
      total: users.length,
      admins,
      customers
    };
  }, [users]);

  /* ================= Filtering + Search ================= */
  const filteredUsers = useMemo(() => {
    let data = [...users];

    if (filter !== 'ALL') {
      data = data.filter(u => u.userType === filter);
    }

    if (search.trim()) {
      const key = search.toLowerCase();
      data = data.filter(
        u =>
          u.fullName?.toLowerCase().includes(key) ||
          u.username?.toLowerCase().includes(key) ||
          u.email?.toLowerCase().includes(key)
      );
    }

    return data;
  }, [users, filter, search]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="page-container">
      {notification && <Notification {...notification} />}

      {/* ================= Header ================= */}
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">View and manage registered users</p>
      </div>

      {/* ================= Stats ================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FaUsers /></div>
          <div className="stat-content">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger"><FaUserShield /></div>
          <div className="stat-content">
            <div className="stat-label">Admins</div>
            <div className="stat-value">{stats.admins}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success"><FaUser /></div>
          <div className="stat-content">
            <div className="stat-label">Customers</div>
            <div className="stat-value">{stats.customers}</div>
          </div>
        </div>
      </div>

      {/* ================= User Table ================= */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Users List</h3>

          <div className="filter-buttons">
            <button
              className={`btn btn-secondary ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All
            </button>
            <button
              className={`btn btn-danger ${filter === 'ADMIN' ? 'active' : ''}`}
              onClick={() => setFilter('ADMIN')}
            >
              Admins
            </button>
            <button
              className={`btn btn-success ${filter === 'CUSTOMER' ? 'active' : ''}`}
              onClick={() => setFilter('CUSTOMER')}
            >
              Customers
            </button>
          </div>
        </div>

        {/* Search + Refresh */}
        <div className="table-tools">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search name, username or email"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button className="btn btn-secondary" onClick={fetchUsers}>
            <FaSyncAlt /> Refresh
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber || 'N/A'}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          user.userType === 'ADMIN' ? 'danger' : 'info'
                        }`}
                      >
                        {user.userType}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;