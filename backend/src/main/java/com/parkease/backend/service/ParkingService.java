package com.parkease.backend.service;

import com.parkease.backend.model.Booking;
import com.parkease.backend.model.ParkingSlot;
import com.parkease.backend.model.Vehicle;
import com.parkease.backend.repository.BookingRepository;
import com.parkease.backend.repository.ParkingSlotRepository;
import com.parkease.backend.repository.UserRepository;
import com.parkease.backend.repository.VehicleRepository;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

@Service
public class ParkingService {

    @Autowired
    private ParkingSlotRepository slotRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // ---------------- CONSTANTS ----------------
    private static final Map<String, Double> HOURLY_RATE = Map.of(
            "SMALL", 10.0,
            "MEDIUM", 20.0,
            "LARGE", 30.0
    );

    private static final int TOTAL_SLOTS = 20;

    // ---------------- INITIALIZE SLOTS ----------------
    @PostConstruct
    public void initializeSlots() {
        if (slotRepository.count() == 0) {

            // SMALL slots (1–10)
            for (int i = 1; i <= 10; i++) {
                ParkingSlot slot = new ParkingSlot(i, 1, "SMALL");
                slot.setIsAvailable(true);
                slot.setIsOccupied(false);
                slotRepository.save(slot);
            }

            // MEDIUM slots (11–17)
            for (int i = 11; i <= 17; i++) {
                ParkingSlot slot = new ParkingSlot(i, 1, "MEDIUM");
                slot.setIsAvailable(true);
                slot.setIsOccupied(false);
                slotRepository.save(slot);
            }

            // LARGE slots (18–20)
            for (int i = 18; i <= 20; i++) {
                ParkingSlot slot = new ParkingSlot(i, 1, "LARGE");
                slot.setIsAvailable(true);
                slot.setIsOccupied(false);
                slotRepository.save(slot);
            }

            System.out.println("✅ Parking slots initialized automatically");
        } else {
            System.out.println("ℹ️ Parking slots already exist");
        }
    }

    // ---------------- PARK VEHICLE ----------------
@Transactional
public Map<String, Object> parkVehicle(
        String licensePlate,
        String vehicleType,
        String ownerName,
        String phoneNumber,
        Long userId,
        Long locationId   // ✅ ADDED
) {
    Map<String, Object> response = new HashMap<>();
    try {
        String normalizedLicense = licensePlate.toUpperCase();
        String normalizedType = vehicleType.toUpperCase();

        // 1️⃣ Get or create vehicle
        Vehicle vehicle = vehicleRepository.findByLicensePlate(normalizedLicense)
                .orElseGet(() -> {
                    Vehicle v = new Vehicle(normalizedLicense, normalizedType, ownerName, phoneNumber);
                    if (userId != null) {
                        userRepository.findById(userId).ifPresent(v::setUser);
                    }
                    return vehicleRepository.save(v);
                });

        // 2️⃣ Check if already parked
        boolean alreadyParked = bookingRepository.findByVehicle_Id(vehicle.getId())
                .stream()
                .anyMatch(b -> "ACTIVE".equals(b.getStatus()));

        if (alreadyParked) {
            response.put("success", false);
            response.put("message", "Vehicle is already parked!");
            return response;
        }

        // 3️⃣ Find slot
        String slotType = getSlotTypeForVehicle(normalizedType);
        Optional<ParkingSlot> availableSlot = findBestSlot(slotType);

        if (availableSlot.isEmpty()) {
            response.put("success", false);
            response.put("message", "No available parking slots!");
            return response;
        }

        ParkingSlot slot = availableSlot.get();

        // 4️⃣ Create booking
        Booking booking = new Booking();
        booking.setVehicle(vehicle);
        booking.setParkingSlot(slot);
        booking.setBookingNumber("BK" + System.currentTimeMillis());
        booking.setHourlyRate(HOURLY_RATE.get(slot.getSlotType()));

        bookingRepository.save(booking);

        // 5️⃣ Update slot
        slot.setIsAvailable(false);
        slot.setIsOccupied(true);
        slot.setCurrentBooking(booking);
        slotRepository.save(slot);

        // 6️⃣ Response
        response.put("success", true);
        response.put("message", "Vehicle parked successfully!");
        response.put("bookingNumber", booking.getBookingNumber());
        response.put("slotNumber", slot.getSlotNumber());
        response.put("entryTime", booking.getEntryTime());
        response.put("hourlyRate", booking.getHourlyRate());
        response.put("locationId", locationId); // ✅ stored for frontend

    } catch (Exception e) {
        response.put("success", false);
        response.put("message", e.getMessage());
    }

    return response;
}
   
    // ---------------- REMOVE VEHICLE WITH PAYMENT & TIMER ----------------
    @Transactional
    public Map<String, Object> removeVehicle(String licensePlate) {
        Map<String, Object> response = new HashMap<>();
        try {
            Vehicle vehicle = vehicleRepository
                    .findByLicensePlate(licensePlate.toUpperCase())
                    .orElse(null);

            if (vehicle == null) {
                response.put("success", false);
                response.put("message", "Vehicle not found!");
                return response;
            }

            Booking activeBooking = bookingRepository.findByVehicle_Id(vehicle.getId())
                    .stream()
                    .filter(b -> "ACTIVE".equals(b.getStatus()))
                    .findFirst()
                    .orElse(null);

            if (activeBooking == null) {
                response.put("success", false);
                response.put("message", "No active parking found!");
                return response;
            }

            // 1️⃣ Set exit time
            activeBooking.setExitTime(new Date());

            // 2️⃣ Calculate duration in hours
            long durationInMillis = activeBooking.getExitTime().getTime() - activeBooking.getEntryTime().getTime();
            double durationHours = durationInMillis / (1000.0 * 60 * 60); // milliseconds to hours

            // 3️⃣ Calculate total amount
            double totalAmount = Math.ceil(durationHours * activeBooking.getHourlyRate());
            activeBooking.setTotalAmount(totalAmount);

            // 4️⃣ Mark booking as completed
            activeBooking.setStatus("COMPLETED");
            bookingRepository.save(activeBooking);

            // 5️⃣ Vacate slot
            ParkingSlot slot = activeBooking.getParkingSlot();
            slot.setIsAvailable(true);
            slot.setIsOccupied(false);
            slot.setCurrentBooking(null);
            slotRepository.save(slot);

            // 6️⃣ Response
            response.put("success", true);
            response.put("message", "Vehicle removed successfully!");
            response.put("bookingNumber", activeBooking.getBookingNumber());
            response.put("slotNumber", slot.getSlotNumber());
            response.put("entryTime", activeBooking.getEntryTime());
            response.put("exitTime", activeBooking.getExitTime());
            response.put("durationHours", durationHours);
            response.put("totalAmount", totalAmount);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ---------------- SEARCH VEHICLE ----------------
    public Map<String, Object> searchVehicle(String licensePlate) {
        Map<String, Object> response = new HashMap<>();
        Vehicle vehicle = vehicleRepository.findByLicensePlate(licensePlate.toUpperCase())
                .orElse(null);

        if (vehicle == null) {
            response.put("success", false);
            response.put("message", "Vehicle not found!");
            return response;
        }

        Booking activeBooking = bookingRepository.findByVehicle_Id(vehicle.getId())
                .stream()
                .filter(b -> "ACTIVE".equals(b.getStatus()))
                .findFirst()
                .orElse(null);

        response.put("success", true);
        response.put("vehicle", vehicle);
        response.put("isParked", activeBooking != null);

        if (activeBooking != null) {
            response.put("booking", activeBooking);
            response.put("slotNumber", activeBooking.getParkingSlot().getSlotNumber());
        }

        return response;
    }

    // ---------------- DASHBOARD ----------------
    public List<ParkingSlot> getAllSlots() {
        return slotRepository.findAll();
    }

    public long getAvailableSlots() {
        return slotRepository.countByIsOccupiedFalse();
    }

    public long getOccupiedSlots() {
        return slotRepository.countByIsOccupiedTrue();
    }

    public Map<String, Object> generateReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("totalSlots", TOTAL_SLOTS);
        report.put("availableSlots", getAvailableSlots());
        report.put("occupiedSlots", getOccupiedSlots());

        List<Booking> activeBookings = bookingRepository.findByStatus("ACTIVE");
        report.put("activeBookings", activeBookings);
        report.put("totalActiveBookings", activeBookings.size());

        double totalRevenue = bookingRepository.findByStatus("COMPLETED")
                .stream()
                .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0)
                .sum();
        report.put("totalRevenue", totalRevenue);

        return report;
    }

    // ---------------- SLOT TYPE LOGIC ----------------
    private String getSlotTypeForVehicle(String vehicleType) {
        return switch (vehicleType.toUpperCase()) {
            case "BIKE" -> "SMALL";
            case "CAR" -> "MEDIUM";
            case "SUV", "TRUCK" -> "LARGE";
            default -> "MEDIUM";
        };
    }
     
     // ---------------- DASHBOARD BY LOCATION ----------------
public Map<String, Object> generateReportByLocation(Long locationId) {

    Map<String, Object> report = new HashMap<>();

    long totalSlots =
            slotRepository.countByLocation_Id(locationId);

    long availableSlots =
            slotRepository.countByLocation_IdAndIsOccupiedFalseAndIsAvailableTrue(locationId);

    long occupiedSlots =
            slotRepository.countByLocation_IdAndIsOccupiedTrue(locationId);

    report.put("totalSlots", totalSlots);
    report.put("availableSlots", availableSlots);
    report.put("occupiedSlots", occupiedSlots);

    List<Booking> activeBookings =
            bookingRepository.findByLocation_IdAndStatus(locationId, "ACTIVE");

    report.put("activeBookings", activeBookings);
    report.put("totalActiveBookings", activeBookings.size());

    double totalRevenue =
            bookingRepository.findByLocation_IdAndStatus(locationId, "COMPLETED")
                    .stream()
                    .mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0)
                    .sum();

    report.put("totalRevenue", totalRevenue);

    return report;
}
    // ---------------- SMART SLOT ALLOCATION ----------------
    private Optional<ParkingSlot> findBestSlot(String slotType) {
        Optional<ParkingSlot> slot = slotRepository.findFirstByIsOccupiedFalseAndIsAvailableTrueAndSlotType(slotType);

        if (slot.isPresent()) return slot;

        // fallback to LARGE if small/medium not available
        if (!"LARGE".equals(slotType)) {
            return slotRepository.findFirstByIsOccupiedFalseAndIsAvailableTrueAndSlotType("LARGE");
        }

        return Optional.empty();
    }
}