package com.nhom2.qnu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom2.qnu.payload.response.RevenueReportResponse;
import com.nhom2.qnu.payload.response.ServiceUsageReportResponse;
import com.nhom2.qnu.payload.response.VisitReportResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.PaymentDetailsRepository;
import com.nhom2.qnu.repository.ServicesRepository;
import com.nhom2.qnu.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/services")
    public List<ServiceUsageReportResponse> getServiceUsage() {
        return reportService.getServiceUsage();
    }

    @GetMapping("/revenue/monthly")
    public List<RevenueReportResponse> getRevenueByMonth() {
        return reportService.getRevenueByMonth();
    }

    @GetMapping("/visits/daily")
    public List<VisitReportResponse> getDailyVisits() {
        return reportService.getDailyVisits();
    }
}
