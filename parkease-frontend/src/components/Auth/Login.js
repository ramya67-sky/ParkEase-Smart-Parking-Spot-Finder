import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login(formData);

      // ✅ Backend returns { token, user }
      if (response && response.user) {
        const user = response.user;

        onLogin(user);

        // ✅ Redirect based on role
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        setError(response?.message || 'Login failed');
      }

    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="form-label">Username or Email</label>
          <input
            className="form-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username or email"
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

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* ✅ SWITCH TO REGISTER */}
        <div className="auth-switch">
          Don’t have an account? <span onClick={() => navigate('/register')}>Register</span>
        </div>

      </form>
    </div>
  );
};

export default Login;