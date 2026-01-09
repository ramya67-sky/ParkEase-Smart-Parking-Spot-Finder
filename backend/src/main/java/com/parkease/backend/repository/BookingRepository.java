package com.parkease.backend.repository;

import com.parkease.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ================= EXISTING METHODS =================

    // ✅ Find booking by booking number
    Optional<Booking> findByBookingNumber(String bookingNumber);

    // ✅ Find bookings by vehicle id
    List<Booking> findByVehicle_Id(Long vehicleId);

    // ✅ Find bookings by status
    List<Booking> findByStatus(String status);

    // ✅ Find booking by vehicle id and status
    Optional<Booking> findByVehicle_IdAndStatus(Long vehicleId, String status);

    // ✅ Find bookings by location id and status
    List<Booking> findByLocation_IdAndStatus(Long locationId, String status);

    // ================= REPORT METHODS =================

    // 1️⃣ Get all bookings in date range
    List<Booking> findByEntryTimeBetween(Date from, Date to);

    // 2️⃣ Count total bookings in date range
    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.entryTime BETWEEN :from AND :to
    """)
    long countBookingsBetween(@Param("from") Date from,
                              @Param("to") Date to);

    // 3️⃣ Get average parking duration in HOURS
    @Query("""
        SELECT AVG(TIMESTAMPDIFF(HOUR, b.entryTime, b.exitTime))
        FROM Booking b
        WHERE b.entryTime BETWEEN :from AND :to
          AND b.exitTime IS NOT NULL
    """)
    Double getAverageDurationHours(@Param("from") Date from,
                                   @Param("to") Date to);

    // 4️⃣ Get total revenue
    @Query("""
        SELECT COALESCE(SUM(b.totalAmount), 0)
        FROM Booking b
        WHERE b.entryTime BETWEEN :from AND :to
          AND b.status = 'COMPLETED'
    """)
    Double getTotalRevenue(@Param("from") Date from,
                           @Param("to") Date to);

    // 5️⃣ Get peak hour (hour with max entries)
    @Query("""
        SELECT HOUR(b.entryTime), COUNT(b)
        FROM Booking b
        WHERE b.entryTime BETWEEN :from AND :to
        GROUP BY HOUR(b.entryTime)
        ORDER BY COUNT(b) DESC
    """)
    List<Object[]> getPeakHourRaw(@Param("from") Date from,
                                  @Param("to") Date to);

    // 6️⃣ Filter by slot + date (for export feature later)
    @Query("""
        SELECT b
        FROM Booking b
        WHERE b.entryTime BETWEEN :from AND :to
          AND (:slotId IS NULL OR b.parkingSlot.id = :slotId)
    """)
    List<Booking> findBookingsForExport(@Param("from") Date from,
                                        @Param("to") Date to,
                                        @Param("slotId") Long slotId);
}