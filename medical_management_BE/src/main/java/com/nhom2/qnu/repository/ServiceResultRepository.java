package com.nhom2.qnu.repository;
import java.util.List;

import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.ServiceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceResultRepository extends JpaRepository<ServiceResult, String> {
    boolean existsByPatient_PatientIdAndService_ServiceIdAndStatus(
            String patientId,
            String serviceId,
            String status);

    // Lấy tất cả kết quả của 1 bệnh nhân có status nhất định
    List<ServiceResult> findByPatient_PatientIdAndStatus(String patientId, String status);

    // Lấy các bệnh nhân distinct đã có kết quả cận lâm sàng hoàn thành
    @Query("SELECT DISTINCT sr.patient FROM ServiceResult sr WHERE sr.status = :status")
    List<Patients> findDistinctPatientsByStatus(@Param("status") String status);

    // Nếu bạn muốn filter theo bác sĩ phụ trách
    @Query("SELECT DISTINCT sr.patient FROM ServiceResult sr " +
            "WHERE sr.status = :status AND sr.doctor.doctorId = :doctorId")
    List<Patients> findDistinctPatientsByStatusAndDoctor(
            @Param("status") String status,
            @Param("doctorId") String doctorId
    );
}

