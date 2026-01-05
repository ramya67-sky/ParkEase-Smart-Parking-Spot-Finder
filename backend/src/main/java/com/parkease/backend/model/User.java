package com.parkease.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // username = display name
    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    // ✅ Allow password in request, hide in response
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    // ADMIN / USER
    @Column(name = "user_type", nullable = false)
    private String userType;

    // Vehicle details
    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "vehicle_number")
    private String vehicleNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ---------------- CONSTRUCTORS ----------------

    public User() {
        this.createdAt = LocalDateTime.now();
        this.userType = "USER";
    }

    // ---------------- GETTERS & SETTERS ----------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) {
        this.userType = userType != null ? userType.toUpperCase() : "USER";
    }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType != null ? vehicleType.toUpperCase() : null;
    }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber != null ? vehicleNumber.toUpperCase() : null;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}