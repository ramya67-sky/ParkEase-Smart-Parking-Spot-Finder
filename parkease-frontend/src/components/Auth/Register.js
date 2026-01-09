// src/components/Auth/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/auth";
import "./Auth.css";

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    userType: "USER"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await authService.register(formData);

      if (response && response.user) {
        onRegister(response.user);
        navigate("/login"); // after register go to login
      } else {
        setError(response?.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper register-wrapper">
        <div className="auth-right">
          <div className="auth-form-container register-form-container">

            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Register to use ParkEase</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>

              <div className="form-group">
                <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
              </div>

              <div className="form-group">
                <input name="username" placeholder="Username" onChange={handleChange} required />
              </div>

              <div className="form-group">
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
              </div>

              <div className="form-group">
                <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
              </div>

              <div className="form-group">
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
              </div>

              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>

            </form>

            <div className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;