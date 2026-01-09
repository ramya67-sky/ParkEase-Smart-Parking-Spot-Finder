// ================================
// API Configuration
// ================================
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const AUTH_API = `${API_BASE_URL}/api/auth`;
export const PARKING_API = `${API_BASE_URL}/api/parking`;
export const PAYMENT_API = `${API_BASE_URL}/api/payments`;

// ================================
// UPI / Manual Payment Configuration
// ================================
export const PAYMENT_METHODS = {
  GPAY: 'GPAY',
  PHONEPE: 'PHONEPE',
  PAYTM: 'PAYTM',
  CASH: 'CASH'
};

export const UPI_IDS = {
  GPAY: 'smartparking@okaxis',
  PHONEPE: 'smartparking@ybl',
  PAYTM: 'smartparking@paytm'
};

export const PAYMENT_INSTRUCTIONS = {
  GPAY: 'Pay using Google Pay via UPI ID',
  PHONEPE: 'Pay using PhonePe via UPI ID',
  PAYTM: 'Pay using Paytm via UPI ID',
  CASH: 'Pay directly at parking counter'
};


// ================================
// Vehicle Types & Rates
// ================================
export const VEHICLE_TYPES = [
  { value: 'BIKE', label: '🏍️ Bike', rate: 10 },
  { value: 'CAR', label: '🚗 Car', rate: 20 },
  { value: 'SUV', label: '🚙 SUV', rate: 30 },
  { value: 'TRUCK', label: '🚛 Truck', rate: 50 }
];


// ================================
// Slot Types
// ================================
export const SLOT_TYPES = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE'
};


// ================================
// User Roles
// ================================
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};


// ================================
// Booking Status
// ================================
export const BOOKING_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};


// ================================
// Payment Status
// ================================
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED'
};


// ================================
// Local Storage Keys
// ================================
export const STORAGE_KEYS = {
  USER: 'parkingUser',
  TOKEN: 'parkingToken'
};


// ================================
// Toast / Alert Messages
// ================================
export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  REGISTER_SUCCESS: 'Registration successful!',
  PARK_SUCCESS: 'Vehicle parked successfully!',
  REMOVE_SUCCESS: 'Vehicle removed successfully!',
  PAYMENT_SUCCESS: 'Payment successful!',
  PAYMENT_PENDING: 'Waiting for payment confirmation',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  ERROR: 'Something went wrong. Please try again.'
};


// ================================
// Validation Patterns
// ================================
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  LICENSE_PLATE: /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/,
  PASSWORD: /^.{6,}$/
};


// ================================
// Date / Time Formats
// ================================
export const DATE_FORMAT = 'DD-MM-YYYY';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATETIME_FORMAT = 'DD-MM-YYYY HH:mm:ss';


// ================================
// Pagination
// ================================
export const ITEMS_PER_PAGE = 10;


// ================================
// Theme Colors (UI Consistency)
// ================================
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#48bb78',
  ERROR: '#f56565',
  WARNING: '#ed8936',
  INFO: '#4299e1',

  SLOT_AVAILABLE: '#48bb78',
  SLOT_OCCUPIED: '#f56565',
  SLOT_UNAVAILABLE: '#a0aec0'
};