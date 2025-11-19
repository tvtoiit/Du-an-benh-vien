package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.ServiceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceResultRepository extends JpaRepository<ServiceResult, String> {
    boolean existsByPatient_PatientIdAndService_ServiceIdAndStatus(
            String patientId,
            String serviceId,
            String status);
}
