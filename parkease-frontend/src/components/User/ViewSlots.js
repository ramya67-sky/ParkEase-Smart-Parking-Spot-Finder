import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { PARKING_API } from '../../utils/constants';
import SlotCard from '../Common/SlotCard';
import Notification from '../Common/Notification';
import { FaSyncAlt } from 'react-icons/fa';
import './User.css';

const ViewSlots = () => {
  const [slots, setSlots] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [errorShown, setErrorShown] = useState(false);

  /* 🔄 Auto Refresh */
  useEffect(() => {
    fetchSlots();

    const interval = setInterval(() => {
      fetchSlots(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* 📡 Fetch Slots */
  const fetchSlots = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const response = await api.get(`${PARKING_API}/slots`);
      setSlots(response.data || []);
      setLastUpdated(new Date());
      setErrorShown(false);
    } catch (error) {
      if (!errorShown) {
        showNotification('Failed to fetch parking slots', 'error');
        setErrorShown(true);
      }
    } finally {
      setLoading(false);
    }
  };

  /* 🔔 Notifications */
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /* 🔍 Filtering Logic */
  const getFilteredSlots = () => {
    let filtered = [...slots];

    if (statusFilter === 'AVAILABLE') {
      filtered = filtered.filter(
        s => s.isAvailable && !s.isOccupied
      );
    } else if (statusFilter === 'OCCUPIED') {
      filtered = filtered.filter(s => s.isOccupied);
    } else if (statusFilter === 'UNAVAILABLE') {
      filtered = filtered.filter(s => !s.isAvailable);
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(s => s.slotType === typeFilter);
    }

    return filtered;
  };

  /* 📊 Stats */
  const stats = {
    total: slots.length,
    available: slots.filter(s => s.isAvailable && !s.isOccupied).length,
    occupied: slots.filter(s => s.isOccupied).length,
    unavailable: slots.filter(s => !s.isAvailable).length
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading parking slots...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* 🧾 Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Parking Slots Overview</h1>
          <p className="page-subtitle">
            Live monitoring of parking availability
            {lastUpdated && (
              <span className="last-updated">
                • Updated at {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => fetchSlots()}
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {/* 📊 Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-label">Total Slots</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-content">
            <div className="stat-label">Available</div>
            <div className="stat-value">{stats.available}</div>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-content">
            <div className="stat-label">Occupied</div>
            <div className="stat-value">{stats.occupied}</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-content">
            <div className="stat-label">Unavailable</div>
            <div className="stat-value">{stats.unavailable}</div>
          </div>
        </div>
      </div>

      {/* 🅿 Slot Grid */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Parking Slots</h3>

          <div className="filter-buttons">
            <button
              className={`btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All
            </button>
            <button
              className={`btn btn-success ${statusFilter === 'AVAILABLE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('AVAILABLE')}
            >
              Available
            </button>
            <button
              className={`btn btn-danger ${statusFilter === 'OCCUPIED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('OCCUPIED')}
            >
              Occupied
            </button>
            <button
              className={`btn btn-warning ${statusFilter === 'UNAVAILABLE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('UNAVAILABLE')}
            >
              Unavailable
            </button>

            <select
              className="slot-type-filter"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="BIKE">Bike</option>
              <option value="CAR">Car</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>
        </div>

        <div className="slots-grid">
          {getFilteredSlots().length === 0 ? (
            <div className="empty-state">
              <p>No slots found for selected filter</p>
            </div>
          ) : (
            getFilteredSlots().map(slot => (
              <SlotCard
                key={slot.id}
                slot={slot}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSlots;