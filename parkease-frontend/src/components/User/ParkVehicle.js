import React, { useState, useEffect, useRef } from 'react';
import {
  FaCar,
  FaCheck,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
} from 'react-icons/fa';
import api from '../../services/api';
import { PARKING_API, VEHICLE_TYPES } from '../../utils/constants';
import { initiatePayment, verifyPayment } from '../../services/payment';
import SlotCard from '../Common/SlotCard';
import Notification from '../Common/Notification';
import './User.css';

const ParkVehicle = ({ user }) => {
  const slotsRef = useRef(null);

  const [formData, setFormData] = useState({
    licensePlate: '',
    vehicleType: 'CAR',
    ownerName: user.fullName,
    phoneNumber: user.phoneNumber || '',
    paymentMethod: 'cash',
    upiId: '',
  });

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Timer in seconds
  const [showUpiModal, setShowUpiModal] = useState(false);

  // Get GPS Location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos =>
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => {}
    );
  }, []);

  // Fetch slots repeatedly
  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await api.get(`${PARKING_API}/slots`);
      setSlots(res.data);
    } catch {
      showNotification('Failed to fetch slots', 'error');
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSlotSelect = slot => {
    if (slot.isOccupied || !slot.isAvailable) {
      showNotification('Slot not available', 'error');
      return;
    }
    setSelectedSlot(slot);
  };

  const scrollToSlots = () => {
    slotsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Parking submission
  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.licensePlate || !/^\d{10}$/.test(formData.phoneNumber)) {
      showNotification('Enter valid license plate & phone number', 'error');
      return;
    }

    if (!selectedSlot) {
      showNotification('Select a parking slot first', 'error');
      scrollToSlots();
      return;
    }

    // Decide payment method
    formData.paymentMethod === 'cash' ? startParking() : setShowUpiModal(true);
  };

  const startParking = async (transactionId = null) => {
    setLoading(true);
    try {
      const res = await api.post(`${PARKING_API}/park`, {
        ...formData,
        userId: user.id,
        slotNumber: selectedSlot.slotNumber,
        location: userLocation,
        transactionId,
      });

      if (res.data?.success) {
        setBookingDetails({
          bookingId: res.data.bookingId,
          bookingNumber: res.data.bookingNumber,
          slotNumber: selectedSlot.slotNumber,
          vehicleNumber: formData.licensePlate,
          amount: formData.paymentMethod === 'cash' ? calculateAmount() : null,
          paymentMethod: formData.paymentMethod,
        });
        setShowSuccess(true);
        fetchSlots();
        startTimer();
      } else {
        showNotification(res.data?.message || 'Parking failed', 'error');
      }
    } catch {
      showNotification('Parking failed. Try again.', 'error');
    } finally {
      setLoading(false);
      setShowUpiModal(false);
    }
  };

  const calculateAmount = () => {
    // For demo, fixed rate by vehicle type
    return VEHICLE_TYPES.find(v => v.value === formData.vehicleType)?.rate || 20;
  };

  // Timer logic
  const startTimer = () => {
    setElapsedTime(0);
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    // Save timer interval to stop later if needed
    return () => clearInterval(timer);
  };

  // UPI payment
  const handleUpiPayment = method => {
    const amount = calculateAmount();
    initiatePayment({
      amount,
      bookingDetails: { vehicleNumber: formData.licensePlate, slotNumber: selectedSlot.slotNumber },
      method,
      onSuccess: async ({ upiId }) => {
        showNotification(`UPI ID: ${upiId}. Payment in process...`, 'success');
        // Simulate transaction id
        const txnId = `TXN${Math.floor(Math.random() * 100000)}`;
        const verify = await verifyPayment({ transactionId: txnId, bookingNumber: bookingDetails?.bookingNumber, amount });
        if (verify.success) {
          startParking(txnId);
        } else {
          showNotification('Payment failed', 'error');
        }
      },
      onFailure: msg => showNotification(msg, 'error'),
    });
  };

  const resetBooking = () => {
    setShowSuccess(false);
    setSelectedSlot(null);
    setBookingDetails(null);
    setElapsedTime(0);
    setFormData({ ...formData, licensePlate: '', upiId: '' });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Format timer
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (showSuccess && bookingDetails) {
    return (
      <div className="success-screen">
        <FaCheck className="success-icon" />
        <h2>Parking Started</h2>
        <p>
          <FaCar /> {bookingDetails.vehicleNumber}
        </p>
        <p>
          <FaMapMarkerAlt /> Slot #{bookingDetails.slotNumber}
        </p>
        <p>
          <FaClock /> Timer: {formatTime(elapsedTime)}
        </p>
        {formData.paymentMethod === 'cash' && (
          <p>
            <FaMoneyBillWave /> Amount Due: ₹{calculateAmount()}
          </p>
        )}

        {showUpiModal && (
          <div className="upi-modal">
            <h4>Select UPI Payment</h4>
            {['gpay', 'phonepe', 'paytm'].map(method => (
              <button key={method} onClick={() => handleUpiPayment(method)}>
                Pay via {method.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <button className="btn btn-primary" onClick={resetBooking}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {notification && <Notification {...notification} />}

      <form onSubmit={handleSubmit} className="card">
        <input
          name="licensePlate"
          placeholder="License Plate"
          value={formData.licensePlate}
          onChange={handleChange}
          required
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          maxLength="10"
          required
        />

        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
        >
          {VEHICLE_TYPES.map(v => (
            <option key={v.value} value={v.value}>
              {v.label} - ₹{v.rate}
            </option>
          ))}
        </select>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="cash">Cash</option>
          <option value="online">UPI</option>
        </select>

        <button disabled={loading}>
          {loading ? 'Processing...' : 'Start Parking'}
        </button>
      </form>

      <div ref={slotsRef} className="slots-grid">
        {slots.map(slot => (
          <SlotCard
            key={slot.id}
            slot={slot}
            selected={selectedSlot?.id === slot.id}
            onSelect={handleSlotSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ParkVehicle;