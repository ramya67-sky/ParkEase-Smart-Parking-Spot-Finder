package com.parkease.backend.controller;

import com.parkease.backend.dto.ReportResponse;
import com.parkease.backend.service.ReportExportService;
import com.parkease.backend.service.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    private final ReportService reportService;
    private final ReportExportService reportExportService;

    public ReportController(ReportService reportService, ReportExportService reportExportService) {
        this.reportService = reportService;
        this.reportExportService = reportExportService;
    }

    // ================= NORMAL JSON REPORT =================
    @GetMapping("/usage")
    public ReportResponse getUsageReport(
            @RequestParam("from") String fromDate,
            @RequestParam("to") String toDate
    ) {
        LocalDate from = LocalDate.parse(fromDate);
        LocalDate to = LocalDate.parse(toDate);

        return reportService.getUsageReport(from, to);
    }

    // ================= CSV EXPORT =================
    @GetMapping("/usage/export")
    public ResponseEntity<InputStreamResource> exportUsageReportCSV(
            @RequestParam("from") String fromDate,
            @RequestParam("to") String toDate
    ) {
        LocalDate from = LocalDate.parse(fromDate);
        LocalDate to = LocalDate.parse(toDate);

        InputStreamResource file = new InputStreamResource(
                reportExportService.exportUsageReportToCSV(from, to)
        );

        String filename = "parking_report_" + from + "_to_" + to + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(file);
    }
}