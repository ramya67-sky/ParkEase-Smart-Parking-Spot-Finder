import React, { useEffect, useState } from "react";
import { FaCar, FaMoneyBillWave, FaClock, FaParking } from "react-icons/fa";
import api from "../../services/api";
import "./Admin.css";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    totalSlots: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // ✅ CORRECT BACKEND ENDPOINT
      const res = await api.get(
        "/admin/reports/usage?from=2026-01-01&to=2026-12-31"
      );

      const data = res.data;

      setStats({
        totalBookings: data.totalBookings || 0,
        activeBookings: data.activeBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        totalSlots: data.totalSlots || 0,
      });
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container">Loading dashboard...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Real-time parking system overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FaCar />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Bookings</div>
            <div className="stat-value">{stats.totalBookings}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FaClock />
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Vehicles</div>
            <div className="stat-value">{stats.activeBookings}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">₹{stats.totalRevenue}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <FaParking />
          </div>
          <div className="stat-content">
            <div className="stat-label">Parking Slots</div>
            <div className="stat-value">{stats.totalSlots}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;