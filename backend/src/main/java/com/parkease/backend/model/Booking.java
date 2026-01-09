package com.parkease.backend.model;

import jakarta.persistence.*;
import java.util.Date;

/**
 * Booking entity representing a parking booking record.
 */
@Entity
@Table(name = "bookings") // Matches MySQL table name
public class Booking {

    // ================= PRIMARY KEY =================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= BASIC COLUMNS =================
    @Column(name = "booking_number", nullable = false, unique = true)
    private String bookingNumber; // Unique booking identifier

    @Column(name = "hourly_rate")
    private Double hourlyRate; // Rate per hour for parking

    @Column(name = "payment_status")
    private String paymentStatus; // PENDING / PAID

    @Column(name = "status")
    private String status; // ACTIVE / COMPLETED

    @Column(name = "total_amount")
    private Double totalAmount; // Calculated total amount

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "entry_time")
    private Date entryTime; // Entry timestamp

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "exit_time")
    private Date exitTime; // Exit timestamp

    // ================= RELATIONSHIPS =================
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle; // Vehicle associated with the booking

    @ManyToOne
    @JoinColumn(name = "slot_id", nullable = false)
    private ParkingSlot parkingSlot; // Slot assigned for this booking

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private ParkingLocation location; // Parking location

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public String getBookingNumber() {
        return bookingNumber;
    }

    public void setBookingNumber(String bookingNumber) {
        this.bookingNumber = bookingNumber;
    }

    public Double getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(Double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Date getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(Date entryTime) {
        this.entryTime = entryTime;
    }

    public Date getExitTime() {
        return exitTime;
    }

    public void setExitTime(Date exitTime) {
        this.exitTime = exitTime;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public ParkingSlot getParkingSlot() {
        return parkingSlot;
    }

    public void setParkingSlot(ParkingSlot parkingSlot) {
        this.parkingSlot = parkingSlot;
    }

    public ParkingLocation getLocation() {
        return location;
    }

    public void setLocation(ParkingLocation location) {
        this.location = location;
    }

    // ================= BUSINESS LOGIC =================

    /**
     * Complete the booking.
     * Sets exit time, status, payment, and calculates total amount based on duration.
     */
    public void completeBooking() {
        // Mark booking as completed
        this.status = "COMPLETED";

        // Mark payment as paid
        this.paymentStatus = "PAID";

        // Set exit time as now
        this.exitTime = new Date();

        // Calculate total amount based on hourly rate
        if (entryTime != null && hourlyRate != null) {
            long durationInMillis = exitTime.getTime() - entryTime.getTime();
            double hours = durationInMillis / (1000.0 * 60 * 60); // convert milliseconds to hours
            this.totalAmount = Math.ceil(hours * hourlyRate); // round up to nearest integer
        }
    }

    /**
     * Get parking duration in hours (rounded up).
     *
     * @return duration in hours
     */
    public long getParkingDurationHours() {
        if (entryTime == null || exitTime == null) {
            return 0;
        }
        long durationInMillis = exitTime.getTime() - entryTime.getTime();
        return (long) Math.ceil(durationInMillis / (1000.0 * 60 * 60));
    }
}