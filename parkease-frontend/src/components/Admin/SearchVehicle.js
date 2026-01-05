import React, { useState } from 'react';
import {
  FaSearch,
  FaCar,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaTrash
} from 'react-icons/fa';

import api from '../../services/api';
import { PARKING_API } from '../../utils/constants';
import Notification from '../Common/Notification';
import './Admin.css';

const SearchVehicle = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  /* -------------------- Helpers -------------------- */

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  /* -------------------- Actions -------------------- */

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      showNotification('Please enter a license plate number', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.get(
        `${PARKING_API}/search/${query.trim().toUpperCase()}`
      );

      if (res.data?.success) {
        setResult(res.data);
      } else {
        showNotification(res.data?.message || 'Vehicle not found', 'error');
      }
    } catch {
      showNotification('Search failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVehicle = async (licensePlate) => {
    if (!window.confirm(`Remove vehicle ${licensePlate}?`)) return;

    try {
      const res = await api.delete(
        `${PARKING_API}/remove/${licensePlate}`
      );

      if (res.data?.success) {
        showNotification(
          `Vehicle removed successfully! Fee: ₹${res.data.totalAmount}`,
          'success'
        );
        setResult(null);
        setQuery('');
      } else {
        showNotification(res.data?.message || 'Removal failed', 'error');
      }
    } catch {
      showNotification('Failed to remove vehicle', 'error');
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="page-container">
      {notification && (
        <Notification
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Search Vehicle</h1>
        <p className="page-subtitle">
          Find parked vehicle using license plate
        </p>
      </div>

      {/* Search */}
      <div className="card search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="AP39CK1234"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !query.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Result */}
      {result?.success && (
        <div className="card search-result-card">
          <div className="result-header">
            <h3>Vehicle Details</h3>
            <span
              className={`badge ${
                result.isParked ? 'badge-success' : 'badge-info'
              }`}
            >
              {result.isParked ? 'PARKED' : 'NOT PARKED'}
            </span>
          </div>

          <div className="result-grid">
            <ResultItem icon={<FaCar />} label="License Plate">
              {result.vehicle?.licensePlate}
            </ResultItem>

            <ResultItem icon={<FaCar />} label="Vehicle Type">
              {result.vehicle?.vehicleType}
            </ResultItem>

            <ResultItem icon={<FaUser />} label="Owner Name">
              {result.vehicle?.ownerName}
            </ResultItem>

            <ResultItem icon={<FaPhone />} label="Phone Number">
              {result.vehicle?.phoneNumber}
            </ResultItem>

            {result.isParked && (
              <>
                <ResultItem icon={<FaMapMarkerAlt />} label="Slot Number">
                  #{result.slotNumber}
                </ResultItem>

                <ResultItem icon={<FaClock />} label="Entry Time">
                  {formatDate(result.booking?.entryTime)}
                </ResultItem>
              </>
            )}
          </div>

          {result.isParked && (
            <button
              className="btn btn-danger btn-block remove-vehicle-btn"
              onClick={() =>
                handleRemoveVehicle(result.vehicle.licensePlate)
              }
            >
              <FaTrash /> Remove Vehicle & Calculate Fee
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* -------------------- Small Reusable Component -------------------- */

const ResultItem = ({ icon, label, children }) => (
  <div className="result-item">
    <span className="result-icon">{icon}</span>
    <div>
      <div className="result-label">{label}</div>
      <div className="result-value">{children}</div>
    </div>
  </div>
);

export default SearchVehicle;