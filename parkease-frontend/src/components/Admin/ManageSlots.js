import React, { useState, useEffect } from 'react';
import { FaParking, FaToggleOn, FaToggleOff, FaCar, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import { PARKING_API } from '../../utils/constants';
import SlotCard from '../Common/SlotCard';
import Notification from '../Common/Notification';
import './Admin.css';

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0, unavailable: 0 });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ slotNumber: '', slotType: 'CAR', location: '' });
  const [editingSlotId, setEditingSlotId] = useState(null);

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  /* Fetch Slots & Stats */
  const fetchSlots = async () => {
    try {
      const response = await api.get(`${PARKING_API}/slots`);
      setSlots(response.data);

      const available = response.data.filter(s => !s.isOccupied && s.isAvailable).length;
      const occupied = response.data.filter(s => s.isOccupied).length;
      const unavailable = response.data.filter(s => !s.isAvailable).length;

      setStats({
        total: response.data.length,
        available,
        occupied,
        unavailable
      });
    } catch {
      showNotification('Failed to fetch slots', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* Notifications */
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /* Handle form input change */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Add or Edit Slot */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlotId) {
        // Update existing slot
        await api.put(`${PARKING_API}/slots/${editingSlotId}`, formData);
        showNotification('Slot updated successfully', 'success');
      } else {
        // Create new slot
        await api.post(`${PARKING_API}/slots`, formData);
        showNotification('Slot added successfully', 'success');
      }
      setShowForm(false);
      setFormData({ slotNumber: '', slotType: 'CAR', location: '' });
      setEditingSlotId(null);
      fetchSlots();
    } catch {
      showNotification('Failed to save slot', 'error');
    }
  };

  /* Edit slot */
  const handleEdit = (slot) => {
    setFormData({ slotNumber: slot.slotNumber, slotType: slot.slotType, location: slot.location });
    setEditingSlotId(slot.id);
    setShowForm(true);
  };

  /* Delete slot */
  const handleDelete = async (slotId) => {
    if (!window.confirm('Are you sure to delete this slot?')) return;
    try {
      await api.delete(`${PARKING_API}/slots/${slotId}`);
      showNotification('Slot deleted successfully', 'success');
      fetchSlots();
    } catch {
      showNotification('Failed to delete slot', 'error');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      {notification && <Notification {...notification} />}

      <div className="page-header">
        <h1 className="page-title">Manage Parking Slots</h1>
        <p className="page-subtitle">Add, edit, remove or toggle parking slots</p>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> {showForm ? 'Close Form' : 'Add Slot'}
        </button>
      </div>

      {showForm && (
        <form className="card form-card" onSubmit={handleFormSubmit}>
          <input
            name="slotNumber"
            placeholder="Slot Number"
            value={formData.slotNumber}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <select name="slotType" value={formData.slotType} onChange={handleChange}>
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
            <option value="OTHERS">Others</option>
          </select>
          <button className="btn btn-success">{editingSlotId ? 'Update Slot' : 'Add Slot'}</button>
        </form>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon primary"><FaParking /></div><div className="stat-content"><div className="stat-label">Total Slots</div><div className="stat-value">{stats.total}</div></div></div>
        <div className="stat-card"><div className="stat-icon success"><FaToggleOn /></div><div className="stat-content"><div className="stat-label">Available</div><div className="stat-value">{stats.available}</div></div></div>
        <div className="stat-card"><div className="stat-icon danger"><FaCar /></div><div className="stat-content"><div className="stat-label">Occupied</div><div className="stat-value">{stats.occupied}</div></div></div>
        <div className="stat-card"><div className="stat-icon warning"><FaToggleOff /></div><div className="stat-content"><div className="stat-label">Unavailable</div><div className="stat-value">{stats.unavailable}</div></div></div>
      </div>

      {/* Slots */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">All Parking Slots</h3></div>
        <div className="slots-grid">
          {slots.map(slot => (
            <div key={slot.id} className="slot-card-wrapper">
              <SlotCard slot={slot} />
              <div className="slot-actions">
                <button className="btn btn-edit" onClick={() => handleEdit(slot)}><FaEdit /></button>
                <button className="btn btn-delete" onClick={() => handleDelete(slot.id)}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSlots;