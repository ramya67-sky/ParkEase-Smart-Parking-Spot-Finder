package com.parkease.backend.repository;

import com.parkease.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ✅ Find booking by booking number
    Optional<Booking> findByBookingNumber(String bookingNumber);

    // ✅ Find bookings by vehicle id
    List<Booking> findByVehicle_Id(Long vehicleId);

    // ✅ Find bookings by status
    List<Booking> findByStatus(String status);

    // ✅ Find booking by vehicle id and status
    Optional<Booking> findByVehicle_IdAndStatus(Long vehicleId, String status);

    // ✅ Find bookings by location id and status
    List<Booking> findByLocation_IdAndStatus(Long locationId, String status);
}