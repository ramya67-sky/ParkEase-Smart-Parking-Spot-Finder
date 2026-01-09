package com.parkease.backend.service;

import com.parkease.backend.dto.ReportResponse;
import com.parkease.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class ReportService {

    private final BookingRepository bookingRepository;

    public ReportService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public ReportResponse getUsageReport(LocalDate from, LocalDate to) {

        // Convert LocalDate to Date (for JPA)
        Date fromDate = Date.from(from.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date toDate = Date.from(to.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        // 1️⃣ Total bookings
        long totalBookings = bookingRepository.countBookingsBetween(fromDate, toDate);

        // 2️⃣ Average duration
        Double avgDuration = bookingRepository.getAverageDurationHours(fromDate, toDate);
        if (avgDuration == null) avgDuration = 0.0;

        // 3️⃣ Total revenue
        Double totalRevenue = bookingRepository.getTotalRevenue(fromDate, toDate);
        if (totalRevenue == null) totalRevenue = 0.0;

        // 4️⃣ Peak hour calculation
        List<Object[]> peakData = bookingRepository.getPeakHourRaw(fromDate, toDate);

        int peakHour = -1;
        if (!peakData.isEmpty()) {
            peakHour = ((Number) peakData.get(0)[0]).intValue();
        }

        // 5️⃣ Return REAL report
        return new ReportResponse(
                totalBookings,
                avgDuration,
                peakHour,
                totalRevenue
        );
    }
}