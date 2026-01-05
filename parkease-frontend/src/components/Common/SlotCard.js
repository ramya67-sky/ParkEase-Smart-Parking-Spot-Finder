import React from 'react';
import { FaCar, FaMotorcycle, FaTruck, FaBan } from 'react-icons/fa';
import './Common.css';

const SlotCard = ({ slot, onSelect, selected = false }) => {

  /* 🚗 Vehicle Icon based on Slot Type */
  const getVehicleIcon = () => {
    switch (slot.slotType) {
      case 'BIKE':
      case 'SMALL':
        return <FaMotorcycle />;
      case 'CAR':
      case 'MEDIUM':
        return <FaCar />;
      case 'TRUCK':
      case 'LARGE':
      case 'OTHERS':
        return <FaTruck />;
      default:
        return <FaCar />;
    }
  };

  /* 🎨 Slot CSS class */
  const getSlotClass = () => {
    let className = 'slot-card';

    if (!slot.isAvailable) {
      className += ' slot-unavailable';
    } else if (slot.isOccupied) {
      className += ' slot-occupied';
    } else {
      className += ' slot-available';
    }

    if (selected) {
      className += ' slot-selected';
    }

    return className;
  };

  /* 🖱 Click handler (User only) */
  const handleClick = () => {
    if (!onSelect) return;

    if (slot.isAvailable && !slot.isOccupied) {
      onSelect(slot);
    }
  };

  /* 🏷 Status Text */
  const getStatusText = () => {
    if (!slot.isAvailable) return 'UNAVAILABLE';
    if (slot.isOccupied) return 'OCCUPIED';
    return 'AVAILABLE';
  };

  return (
    <div
      className={getSlotClass()}
      onClick={handleClick}
      role="button"
      aria-label={`Parking Slot ${slot.slotNumber}`}
      title={
        slot.isOccupied && slot.currentBooking
          ? `Occupied by ${slot.currentBooking.vehicle?.licensePlate}`
          : getStatusText()
      }
    >
      {/* Slot Number */}
      <div className="slot-number">
        #{slot.slotNumber}
      </div>

      {/* Icon */}
      <div className="slot-icon">
        {slot.isAvailable ? getVehicleIcon() : <FaBan />}
      </div>

      {/* Slot Type */}
      <div className="slot-type">
        {slot.slotType}
      </div>

      {/* Vehicle Info */}
      {slot.isOccupied && slot.currentBooking && (
        <div className="slot-vehicle-info">
          <div className="slot-vehicle-number">
            {slot.currentBooking.vehicle?.licensePlate}
          </div>
        </div>
      )}

      {/* Status */}
      <div className={`slot-status ${getStatusText().toLowerCase()}`}>
        {getStatusText()}
      </div>

      {/* Selected Badge */}
      {selected && (
        <div className="slot-selected-badge">
          SELECTED
        </div>
      )}
    </div>
  );
};

export default SlotCard;