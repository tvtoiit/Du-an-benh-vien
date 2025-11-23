package com.nhom2.qnu.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nhom2.qnu.payload.response.RevenueReportResponse;
import com.nhom2.qnu.payload.response.ServiceUsageReportResponse;
import com.nhom2.qnu.payload.response.VisitReportResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.PaymentDetailsRepository;
import com.nhom2.qnu.repository.ServicesRepository;
import com.nhom2.qnu.service.ReportService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ServicesRepository servicesRepo;
    private final PaymentDetailsRepository paymentRepo;
    private final AppointmentRepository appointmentRepo;

    @Override
    public List<ServiceUsageReportResponse> getServiceUsage() {
        return servicesRepo.getServiceUsageStats();
    }

    @Override
    public List<RevenueReportResponse> getRevenueByMonth() {
        return paymentRepo.getMonthlyRevenue();
    }

    @Override
    public List<VisitReportResponse> getDailyVisits() {
        return appointmentRepo.getDailyVisits();
    }
}
