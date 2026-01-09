package com.parkease.backend.dto;

public class ReportResponse {

    private long totalBookings;
    private double averageDuration;
    private int peakHour;
    private double totalRevenue;

    public ReportResponse() {}

    public ReportResponse(long totalBookings, double averageDuration, int peakHour, double totalRevenue) {
        this.totalBookings = totalBookings;
        this.averageDuration = averageDuration;
        this.peakHour = peakHour;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public double getAverageDuration() {
        return averageDuration;
    }

    public void setAverageDuration(double averageDuration) {
        this.averageDuration = averageDuration;
    }

    public int getPeakHour() {
        return peakHour;
    }

    public void setPeakHour(int peakHour) {
        this.peakHour = peakHour;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}