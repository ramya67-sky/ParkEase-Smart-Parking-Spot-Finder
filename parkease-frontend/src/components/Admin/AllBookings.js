import React, { useState, useEffect } from 'react';
import {
  FaCar,
  FaClock,
  FaMoneyBillWave,
  FaTrash,
  FaListAlt
} from 'react-icons/fa';
import api from '../../services/api';
import { PARKING_API } from '../../utils/constants';
import Notification from '../Common/Notification';
import './Admin.css';

const HOURLY_RATE = 50; // Dummy rate

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    revenue: 0
  });
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [now, setNow] = useState(Date.now());

  /* ⏱ Live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get(`${PARKING_API}/bookings`);
      const all = res.data || [];

      const active = all.filter(b => b.status === 'ACTIVE');
      const completed = all.filter(b => b.status === 'COMPLETED');

      const revenue = completed.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0
      );

      setBookings(all);
      setStats({
        total: all.length,
        active: active.length,
        completed: completed.length,
        revenue
      });
    } catch {
      showNotification('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (entryTime, exitTime) => {
    const start = new Date(entryTime).getTime();
    const end = exitTime ? new Date(exitTime).getTime() : now;
    const diff = end - start;

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    return `${hrs}h ${mins}m`;
  };

  const calculateAmount = (entryTime, exitTime) => {
    const start = new Date(entryTime).getTime();
    const end = exitTime ? new Date(exitTime).getTime() : now;
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    return hours * HOURLY_RATE;
  };

  /* 🛑 Force checkout */
  const handleExit = async (bookingId) => {
    if (!window.confirm('Confirm checkout?')) return;

    try {
      await api.post(`${PARKING_API}/checkout/${bookingId}`);
      showNotification('Vehicle checked out successfully', 'success');
      loadBookings();
    } catch {
      showNotification('Checkout failed', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredBookings =
    filter === 'ACTIVE'
      ? bookings.filter(b => b.status === 'ACTIVE')
      : bookings;

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="page-container">
      {notification && <Notification {...notification} />}

      <div className="page-header">
        <h1 className="page-title">Booking Overview</h1>
        <p className="page-subtitle">
          Live parking sessions & revenue tracking
        </p>
      </div>

      {/* 📊 Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaListAlt /> <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <FaClock /> <span>Active</span>
          <strong>{stats.active}</strong>
        </div>
        <div className="stat-card">
          <FaMoneyBillWave /> <span>Revenue</span>
          <strong>₹{stats.revenue}</strong>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="card">
        <div className="card-header">
          <h3>Bookings</h3>
          <button
            className="btn btn-secondary"
            onClick={() => setFilter(filter === 'ALL' ? 'ACTIVE' : 'ALL')}
          >
            {filter}
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Slot</th>
              <th>Entry</th>
              <th>Duration</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id}>
                <td>{b.bookingNumber}</td>
                <td>{b.vehicle?.licensePlate || 'N/A'}</td>
                <td>#{b.parkingSlot?.slotNumber || 'N/A'}</td>
                <td>{formatDate(b.entryTime)}</td>
                <td>{calculateDuration(b.entryTime, b.exitTime)}</td>
                <td>
                  ₹{b.status === 'ACTIVE'
                    ? calculateAmount(b.entryTime)
                    : b.totalAmount}
                </td>
                <td>
                  <span className={`badge ${b.status === 'ACTIVE' ? 'success' : 'info'}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  {b.status === 'ACTIVE' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleExit(b.id)}
                    >
                      <FaTrash /> Exit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBookings;