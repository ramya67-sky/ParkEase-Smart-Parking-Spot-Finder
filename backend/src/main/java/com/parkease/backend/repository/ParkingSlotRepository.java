package com.parkease.backend.repository;

import com.parkease.backend.model.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {

    // ================= GLOBAL COUNTS =================
    long countByIsOccupiedTrue();
    long countByIsOccupiedFalse();

    // ================= LOCATION-BASED COUNTS =================
    long countByLocation_Id(Long locationId);

    long countByLocation_IdAndIsOccupiedTrue(Long locationId);

    long countByLocation_IdAndIsOccupiedFalseAndIsAvailableTrue(Long locationId);

    // ================= LOCATION SLOT LIST =================
    List<ParkingSlot> findByLocation_Id(Long locationId);

    // ================= SMART SLOT ALLOCATION =================
    Optional<ParkingSlot>
    findFirstByIsOccupiedFalseAndIsAvailableTrueAndSlotType(String slotType);
}