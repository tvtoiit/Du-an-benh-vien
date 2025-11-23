package com.nhom2.qnu.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nhom2.qnu.payload.response.RevenueReportResponse;
import com.nhom2.qnu.payload.response.ServiceUsageReportResponse;
import com.nhom2.qnu.payload.response.VisitReportResponse;

@Service
public interface ReportService {
    List<ServiceUsageReportResponse> getServiceUsage();

    List<RevenueReportResponse> getRevenueByMonth();

    List<VisitReportResponse> getDailyVisits();

}
