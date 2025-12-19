package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Services;
import com.nhom2.qnu.payload.response.ServiceUsageReportResponse;
import com.nhom2.qnu.model.AppointmentServiceItem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicesRepository extends JpaRepository<Services, String> {

    @Query("""
                SELECT new com.nhom2.qnu.payload.response.ServiceUsageReportResponse(
                    s.serviceName,
                    COUNT(asi.id),
                    SUM(s.price)
                )
                FROM AppointmentServiceItem asi
                JOIN asi.service s
                GROUP BY s.serviceName
                ORDER BY COUNT(asi.id) DESC
            """)
    List<ServiceUsageReportResponse> getServiceUsageStats();

    boolean existsByServiceNameIgnoreCase(String serviceName);

    boolean existsByServiceNameIgnoreCaseAndServiceIdNot(
            String serviceName,
            String serviceId);
}
