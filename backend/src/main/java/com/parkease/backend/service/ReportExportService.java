package com.parkease.backend.service;

import com.parkease.backend.dto.ReportResponse;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDate;

@Service
public class ReportExportService {

    private final ReportService reportService;

    public ReportExportService(ReportService reportService) {
        this.reportService = reportService;
    }

    public ByteArrayInputStream exportUsageReportToCSV(LocalDate from, LocalDate to) {

        ReportResponse report = reportService.getUsageReport(from, to);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        // CSV Header
        writer.println("Total Bookings,Average Duration,Peak Hour,Total Revenue");

        // CSV Data
        writer.println(
                report.getTotalBookings() + "," +
                report.getAverageDuration() + "," +
                report.getPeakHour() + "," +
                report.getTotalRevenue()
        );

        writer.flush();

        return new ByteArrayInputStream(out.toByteArray());
    }
}