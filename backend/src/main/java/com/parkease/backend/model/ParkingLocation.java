package com.parkease.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_locations")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ParkingLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;   // Example: Karur Bus Stand, Phoenix Mall

    @Column(nullable = false)
    private String city;   // Example: Karur, Coimbatore

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // One location → many slots
    @OneToMany(
        mappedBy = "location",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @JsonManagedReference
    private List<ParkingSlot> slots;

    // ---------------- CONSTRUCTORS ----------------

    public ParkingLocation() {
        this.createdAt = LocalDateTime.now();
    }

    public ParkingLocation(String name, String city) {
        this.name = name;
        this.city = city;
        this.createdAt = LocalDateTime.now();
    }

    // ---------------- GETTERS & SETTERS ----------------

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<ParkingSlot> getSlots() {
        return slots;
    }

    public void setSlots(List<ParkingSlot> slots) {
        this.slots = slots;
    }
}