// src/components/Common/LoadingScreen.js
import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="loading-screen">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

export default LoadingScreen;