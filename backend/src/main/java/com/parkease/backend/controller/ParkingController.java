package com.parkease.backend.controller;

import com.parkease.backend.model.ParkingSlot;
import com.parkease.backend.service.ParkingService;
import com.parkease.backend.service.ParkingSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ParkingController {

    @Autowired
    private ParkingService parkingService;

    @Autowired
    private ParkingSlotService parkingSlotService;

    // =====================================================
    // ================= USER APIs =========================
    // =====================================================

    // -------- PARK VEHICLE (START TIMER) --------
    @PostMapping("/parking/park")
    public ResponseEntity<Map<String, Object>> parkVehicle(
            @RequestParam String licensePlate,
            @RequestParam String vehicleType,
            @RequestParam String ownerName,
            @RequestParam String phoneNumber,
            @RequestParam Long locationId,          // 🔥 NEW (Milestone 4)
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.ok(
                parkingService.parkVehicle(
                        licensePlate,
                        vehicleType,
                        ownerName,
                        phoneNumber,
                        userId,
                        locationId
                )
        );
    }

    // -------- UNPARK VEHICLE (STOP TIMER + PAYMENT) --------
    @PostMapping("/parking/unpark")
    public ResponseEntity<Map<String, Object>> unparkVehicle(
            @RequestParam String licensePlate
    ) {
        return ResponseEntity.ok(
                parkingService.removeVehicle(licensePlate)
        );
    }

    // -------- SEARCH VEHICLE STATUS --------
    @GetMapping("/parking/status")
    public ResponseEntity<Map<String, Object>> searchVehicle(
            @RequestParam String licensePlate
    ) {
        return ResponseEntity.ok(
                parkingService.searchVehicle(licensePlate)
        );
    }

    // -------- VIEW AVAILABLE SLOTS BY LOCATION --------
    @GetMapping("/parking/slots")
    public ResponseEntity<List<ParkingSlot>> getSlotsByLocation(
            @RequestParam Long locationId
    ) {
        return ResponseEntity.ok(
                parkingSlotService.getSlotsByLocation(locationId)
        );
    }

    // =====================================================
    // ================= ADMIN APIs ========================
    // =====================================================

    // -------- ADMIN: ADD SLOT --------
    @PostMapping("/admin/parking/slot")
    public ResponseEntity<ParkingSlot> addSlot(
            @RequestParam Integer slotNumber,
            @RequestParam Integer floorNumber,
            @RequestParam String slotType,
            @RequestParam Long locationId
    ) {
        return ResponseEntity.ok(
                parkingSlotService.addSlot(
                        slotNumber,
                        floorNumber,
                        slotType,
                        locationId
                )
        );
    }

    // -------- ADMIN: REMOVE SLOT --------
    @DeleteMapping("/admin/parking/slot/{slotId}")
    public ResponseEntity<String> removeSlot(
            @PathVariable Long slotId
    ) {
        parkingSlotService.removeSlot(slotId);
        return ResponseEntity.ok("Slot removed successfully");
    }

    // -------- ADMIN: DASHBOARD REPORT --------
    @GetMapping("/admin/parking/report")
    public ResponseEntity<Map<String, Object>> getAdminReport(
            @RequestParam Long locationId
    ) {
        return ResponseEntity.ok(
                parkingService.generateReportByLocation(locationId)
        );
    }
}