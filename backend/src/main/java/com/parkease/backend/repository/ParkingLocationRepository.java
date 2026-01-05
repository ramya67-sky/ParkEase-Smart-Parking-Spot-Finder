package com.parkease.backend.repository;

import com.parkease.backend.model.ParkingLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingLocationRepository extends JpaRepository<ParkingLocation, Long> {
}