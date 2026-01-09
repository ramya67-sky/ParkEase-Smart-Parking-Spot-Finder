package com.parkease.backend.service;

import com.parkease.backend.model.ParkingLocation;
import com.parkease.backend.model.ParkingSlot;
import com.parkease.backend.repository.ParkingLocationRepository;
import com.parkease.backend.repository.ParkingSlotRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingSlotService {

    @Autowired
    private ParkingSlotRepository slotRepository;

    @Autowired
    private ParkingLocationRepository locationRepository;

    // 🔥 Automatically runs when server starts
    @PostConstruct
    public void createParkingSlotsAutomatically() {

        // If slots already exist → DO NOTHING
        if (slotRepository.count() > 0) {
            System.out.println("ℹ️ Parking slots already exist, skipping creation");
            return;
        }

        // Fetch all parking locations
        List<ParkingLocation> locations = locationRepository.findAll();

        if (locations.isEmpty()) {
            System.out.println("⚠️ No parking locations found. Slots not created.");
            return;
        }

        // Create default slots for each location
        for (ParkingLocation location : locations) {

            // SMALL slots (1–8)
            for (int i = 1; i <= 8; i++) {
                ParkingSlot slot = new ParkingSlot();
                slot.setSlotNumber("S"+i);
                slot.setFloorNumber(1);
                slot.setSlotType("SMALL");
                slot.setIsAvailable(true);
                slot.setIsOccupied(false);
                slot.setLocation(location);
                slotRepository.save(slot);
            }

            // MEDIUM slots (9–14)
            for (int i = 9; i <= 14; i++) {
                ParkingSlot slot = new ParkingSlot();
                slot.setSlotNumber("S"+i);
                slot.setFloorNumber(1);
                slot.setSlotType("MEDIUM");
                slot.setIsAvailable(true);
                slot.setIsOccupied(false);
                slot.setLocation(location);
                slotRepository.save(slot);
            }

            // LARGE slots (15–20)
            for (int i = 15; i <= 20; i++) {
                ParkingSlot slot = new ParkingSlot();
                slot.setSlotNumber("S"+i);
                slot.setFloorNumber(1);
                slot.setSlotType("LARGE");
                slot.setIsAvailable(true);
                slot.setIsOccupied(false);
                slot.setLocation(location);
                slotRepository.save(slot);
            }

            System.out.println("✅ Slots created for location: " + location.getName());
        }

        System.out.println("✅ All parking slots created successfully");
    }

    // ================= USER API =================
    public List<ParkingSlot> getSlotsByLocation(Long locationId) {
        return slotRepository.findByLocation_Id(locationId);
    }

    // ================= ADMIN API =================
    public ParkingSlot addSlot(String slotNumber, Integer floorNumber, String slotType, Long locationId) {
        ParkingLocation location = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        ParkingSlot slot = new ParkingSlot();
        slot.setSlotNumber(slotNumber);
        slot.setFloorNumber(floorNumber);
        slot.setSlotType(slotType);
        slot.setIsAvailable(true);
        slot.setIsOccupied(false);
        slot.setLocation(location);

        return slotRepository.save(slot);
    }

    public void removeSlot(Long slotId) {
        slotRepository.deleteById(slotId);
    }
}