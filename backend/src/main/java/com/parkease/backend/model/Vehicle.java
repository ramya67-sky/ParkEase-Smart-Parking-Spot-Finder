package com.parkease.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate;

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType;

    @Column(name = "owner_name", nullable = false)
    private String ownerName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // ---------------- CONSTRUCTORS ----------------

    public Vehicle() {}

    // ✅ Add this constructor to fix ParkingService.java error
    public Vehicle(String licensePlate, String vehicleType, String ownerName, String phoneNumber) {
        this.licensePlate = licensePlate;
        this.vehicleType = vehicleType;
        this.ownerName = ownerName;
        this.phoneNumber = phoneNumber;
    }

    // ---------------- GETTERS & SETTERS ----------------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}