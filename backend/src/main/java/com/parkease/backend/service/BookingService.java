package com.parkease.backend.service;

import java.util.HashMap;
import java.util.Map;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.parkease.backend.model.Booking;
import com.parkease.backend.model.ParkingSlot;
import com.parkease.backend.repository.BookingRepository;
import com.parkease.backend.repository.ParkingSlotRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingSlotRepository slotRepository;

    // ---------------- REMOVE VEHICLE ----------------
@Transactional
public Map<String, Object> completeBooking(String bookingNumber) {

    Map<String, Object> response = new HashMap<>();

    Booking booking = bookingRepository
            .findByBookingNumber(bookingNumber)
            .orElse(null);

    if (booking == null || !"ACTIVE".equals(booking.getStatus())) {
        response.put("success", false);
        response.put("message", "Active booking not found");
        return response;
    }

    // 1️⃣ Complete booking
    booking.completeBooking();
    bookingRepository.save(booking);

    // 2️⃣ Find slot using booking ID (DIRECT DB QUERY)
    ParkingSlot slot = slotRepository
            .findByCurrentBookingId(booking.getId())
            .orElseThrow(() -> new RuntimeException("Slot not found for this booking"));

    // 3️⃣ Vacate slot
    slot.vacate();
    slotRepository.save(slot);

    // 4️⃣ Response
    response.put("success", true);
    response.put("entryTime", booking.getEntryTime());
    response.put("exitTime", booking.getExitTime());
    response.put("hours", booking.getParkingDurationHours());
    response.put("amount", booking.getTotalAmount());

    return response;
}
}