// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { MESSAGES, PATTERNS } from '../../utils/constants';
import './Auth.css';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    userType: 'CUSTOMER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      return 'All fields are required.';
    }
    if (!PATTERNS.EMAIL.test(formData.email)) return 'Invalid email address.';
    if (!PATTERNS.PASSWORD.test(formData.password)) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(formData);
      if (response.success) {
        onRegister(response.user);
        // Redirect based on role
        navigate(response.user.userType === 'ADMIN' ? '/admin' : '/user');
      } else {
        setError(response.message || MESSAGES.ERROR);
      }
    } catch (err) {
      setError(err.response?.data?.message || MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;