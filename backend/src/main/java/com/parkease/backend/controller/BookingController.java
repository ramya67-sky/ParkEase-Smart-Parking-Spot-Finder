package com.parkease.backend.controller;

import com.parkease.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ================= COMPLETE BOOKING (EXIT VEHICLE) =================
    @PostMapping("/complete/{bookingNumber}")
    public ResponseEntity<Map<String, Object>> completeBooking(@PathVariable String bookingNumber) {
        Map<String, Object> result = bookingService.completeBooking(bookingNumber);
        return ResponseEntity.ok(result);
    }
}