package com.parkease.backend.repository;

import com.parkease.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payment by booking ID
    Payment findByBookingId(Long bookingId);
}