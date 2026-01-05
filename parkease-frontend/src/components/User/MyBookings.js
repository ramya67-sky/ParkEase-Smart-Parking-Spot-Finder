import React, { useState, useEffect } from 'react';
import {
  FaClock,
  FaCar,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaInfoCircle,
  FaStop,
  FaListAlt
} from 'react-icons/fa';
import api from '../../services/api';
import { PARKING_API } from '../../utils/constants';
import Notification from '../Common/Notification';
import './User.css';

const HOURLY_RATE = 50; // ₹50 per hour

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalFees: 0
  });

  // 🔄 Live timer update every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch all bookings for this user
  const fetchBookings = async () => {
    try {
      const response = await api.get(`${PARKING_API}/user/${user.id}/bookings`);
      if (response.data.success) {
        const allBookings = response.data.bookings || [];
        setBookings(allBookings);
        updateStats(allBookings);
      }
    } catch (error) {
      showNotification('Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update Milestone-4 stats panel
  const updateStats = (allBookings) => {
    const active = allBookings.filter(b => b.status === 'ACTIVE').length;
    const completedBookings = allBookings.filter(b => b.status === 'COMPLETED');
    const totalFees = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    setStats({
      total: allBookings.length,
      active,
      completed: completedBookings.length,
      totalFees
    });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  // Calculate duration for live timer
  const calculateDuration = (entryTime) => {
    const start = new Date(entryTime).getTime();
    const diff = currentTime - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds };
  };

  // Calculate amount due for active bookings
  const calculateAmount = (entryTime) => {
    const start = new Date(entryTime).getTime();
    const diffHours = Math.ceil((currentTime - start) / (1000 * 60 * 60));
    return diffHours * HOURLY_RATE;
  };

  // Checkout (stop timer + payment simulation)
  const handleCheckout = async (bookingId) => {
    try {
      await api.post(`${PARKING_API}/checkout/${bookingId}`);
      showNotification('Payment successful! Slot released.', 'success');
      fetchBookings();
    } catch (error) {
      showNotification('Checkout failed', 'error');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* 🔹 Header */}
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Live status, parking duration & payments</p>
      </div>

      {/* 🔹 Stats Panel (Milestone-4) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FaListAlt /></div>
          <div className="stat-content">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FaClock /></div>
          <div className="stat-content">
            <div className="stat-label">Active</div>
            <div className="stat-value">{stats.active}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info"><FaCar /></div>
          <div className="stat-content">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning"><FaMoneyBillWave /></div>
          <div className="stat-content">
            <div className="stat-label">Total Fees</div>
            <div className="stat-value">₹{stats.totalFees}</div>
          </div>
        </div>
      </div>

      {/* 🔹 Booking Cards */}
      {bookings.length === 0 ? (
        <div className="empty-state">
          <FaCar />
          <p>No bookings yet</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => {
            const isActive = booking.status === 'ACTIVE';
            const duration = isActive ? calculateDuration(booking.entryTime) : null;
            const amount = isActive ? calculateAmount(booking.entryTime) : booking.totalAmount;

            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <span>#{booking.bookingNumber}</span>
                  <span className={`badge ${isActive ? 'success' : 'info'}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-body">
                  <p>
                    <FaCar /> {booking.vehicle.licensePlate} ({booking.vehicle.vehicleType})
                  </p>

                  <p>
                    <FaMapMarkerAlt /> Slot #{booking.parkingSlot.slotNumber}
                  </p>

                  <p>
                    <FaClock /> Entry: {formatDate(booking.entryTime)}
                  </p>

                  {isActive && (
                    <p className="timer">
                      ⏱ {duration.hours}h {duration.minutes}m {duration.seconds}s
                    </p>
                  )}

                  <p className="amount">
                    <FaMoneyBillWave /> ₹{amount} <FaInfoCircle title={`₹${HOURLY_RATE}/hour`} />
                  </p>

                  {isActive && (
                    <button
                      className="btn danger"
                      onClick={() => handleCheckout(booking.id)}
                    >
                      <FaStop /> Checkout & Pay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;