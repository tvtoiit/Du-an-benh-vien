package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Services;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.response.ServiceUsageReportResponse;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicesRepository extends JpaRepository<Services, String> {
    @Query("""
                SELECT new com.nhom2.qnu.payload.response.ServiceUsageReportResponse(
                    s.serviceName,
                    COUNT(ps.patient.patientId),
                    SUM(s.price)
                )
                FROM Services s
                JOIN s.patients ps
                GROUP BY s.serviceName
                ORDER BY COUNT(ps.patient.patientId) DESC
            """)
    List<ServiceUsageReportResponse> getServiceUsageStats();
}
