package com.parkease.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "bookings") // ✅ Matches MySQL table name
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_number", nullable = false, unique = true)
    private String bookingNumber;

    @Column(name = "hourly_rate")
    private Double hourlyRate;

    @Column(name = "payment_status")
    private String paymentStatus; // PENDING / PAID

    @Column(name = "status")
    private String status; // ACTIVE / COMPLETED

    @Column(name = "total_amount")
    private Double totalAmount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "entry_time")
    private Date entryTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "exit_time")
    private Date exitTime;

    // ================= RELATIONSHIPS =================

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "slot_id", nullable = false)
    private ParkingSlot parkingSlot;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private ParkingLocation location;

    // ================= GETTERS & SETTERS =================

    public Long getId() { return id; }

    public String getBookingNumber() { return bookingNumber; }
    public void setBookingNumber(String bookingNumber) { this.bookingNumber = bookingNumber; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Date getEntryTime() { return entryTime; }
    public void setEntryTime(Date entryTime) { this.entryTime = entryTime; }

    public Date getExitTime() { return exitTime; }
    public void setExitTime(Date exitTime) { this.exitTime = exitTime; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public ParkingSlot getParkingSlot() { return parkingSlot; }
    public void setParkingSlot(ParkingSlot parkingSlot) { this.parkingSlot = parkingSlot; }

    public ParkingLocation getLocation() { return location; }
    public void setLocation(ParkingLocation location) { this.location = location; }

    // ================= BUSINESS LOGIC =================

    /**
     * Complete the booking: set exit time, status, payment, and calculate total amount
     */
    public void completeBooking() {
        this.status = "COMPLETED";
        this.paymentStatus = "PAID";
        this.exitTime = new Date();

        if (entryTime != null && hourlyRate != null) {
            long durationInMillis = exitTime.getTime() - entryTime.getTime();
            double hours = durationInMillis / (1000.0 * 60 * 60);
            this.totalAmount = Math.ceil(hours * hourlyRate);
        }
    }

    /**
     * Returns parking duration in hours (rounded up)
     */
    public long getParkingDurationHours() {
        if (entryTime == null || exitTime == null) return 0;

        long durationInMillis = exitTime.getTime() - entryTime.getTime();
        return (long) Math.ceil(durationInMillis / (1000.0 * 60 * 60));
    }
}