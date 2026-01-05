package com.parkease.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parkease.backend.model.Vehicle;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    // ✅ Search by license plate
    Optional<Vehicle> findByLicensePlate(String licensePlate);

    // ✅ Check duplicates
    boolean existsByLicensePlate(String licensePlate);

    // ✅ Filter by type
    List<Vehicle> findByVehicleType(String vehicleType);

    // ✅ Search by owner name
    List<Vehicle> findByOwnerName(String ownerName);

    // ✅ Frontend dashboard: vehicles of a specific user
    List<Vehicle> findByUser_Id(Long userId);

    // 🔥 Useful for booking: first active vehicle of a user
    Optional<Vehicle> findFirstByLicensePlateAndUser_Id(String licensePlate, Long userId);
}