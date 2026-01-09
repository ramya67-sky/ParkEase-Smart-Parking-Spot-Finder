package com.parkease.backend.model;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "parking_slots")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ParkingSlot {

    // ---------------- PRIMARY KEY ----------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---------------- SLOT DETAILS ----------------
    @Column(name = "slot_number", nullable = false)
    private String slotNumber;

    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber;

    @Column(name = "slot_type", nullable = false)
    private String slotType; // SMALL, MEDIUM, LARGE

    // ---------------- STATUS ----------------
    @Column(name = "is_occupied", nullable = false)
    private Boolean isOccupied = false;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    // ---------------- CURRENT BOOKING ----------------
    @ManyToOne
    @JoinColumn(name = "current_booking_id")
    private Booking currentBooking;

    // ---------------- LOCATION ----------------
    @ManyToOne
    @JoinColumn(name = "location_id")
    private ParkingLocation location;

    // ---------------- AUDIT ----------------
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // ---------------- CONSTRUCTORS ----------------
    public ParkingSlot() {
        this.createdAt = LocalDateTime.now();
    }

    public ParkingSlot(String slotNumber, Integer floorNumber, String slotType) {
        this.slotNumber = slotNumber;
        this.floorNumber = floorNumber;
        this.slotType = slotType.toUpperCase();
        this.isOccupied = false;
        this.isAvailable = true;
        this.createdAt = LocalDateTime.now();
    }

    // ---------------- BUSINESS METHODS ----------------
    // ✅ Use when vehicle parks
    public void occupy() {
        this.isOccupied = true;
        this.isAvailable = false;
    }

    // ✅ Use when vehicle leaves
    public void vacate() {
        this.isOccupied = false;
        this.isAvailable = true;
        this.currentBooking = null;
    }

    // ---------------- GETTERS & SETTERS ----------------
    public Long getId() { return id; }
    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }
    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }
    public String getSlotType() { return slotType; }
    public void setSlotType(String slotType) { this.slotType = slotType.toUpperCase(); }
    public Boolean getIsOccupied() { return isOccupied; }
    public void setIsOccupied(Boolean isOccupied) { this.isOccupied = isOccupied; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public Booking getCurrentBooking() { return currentBooking; }
    public void setCurrentBooking(Booking currentBooking) { this.currentBooking = currentBooking; }
    public ParkingLocation getLocation() { return location; }
    public void setLocation(ParkingLocation location) { this.location = location; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}