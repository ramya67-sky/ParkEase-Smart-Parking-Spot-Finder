package com.parkease.backend.controller;

import com.parkease.backend.model.User;
import com.parkease.backend.service.AuthService;
import com.parkease.backend.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ParkingService parkingService;

    @Autowired
    private AuthService authService;

    // ---------------- GET ALL PARKING SLOTS ----------------
    @GetMapping("/slots")
    public ResponseEntity<Map<String, Object>> getAllSlots() {
        return ResponseEntity.ok(Map.of("slots", parkingService.getAllSlots()));
    }

    // ---------------- GENERATE PARKING REPORT ----------------
    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> generateReport() {
        return ResponseEntity.ok(parkingService.generateReport());
    }

    // ---------------- GET ALL USERS ----------------
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    // ---------------- UPDATE USER ----------------
    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable("id") Long id,
            @RequestBody User user
    ) {
        Map<String, Object> response = authService.updateUser(id, user);
        return ResponseEntity.ok(response);
    }

    // ---------------- DELETE USER ----------------
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable("id") Long id) {
        Map<String, Object> response = authService.deleteUser(id);
        return ResponseEntity.ok(response);
    }
}