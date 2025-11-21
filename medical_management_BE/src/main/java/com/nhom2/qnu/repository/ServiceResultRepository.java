package com.nhom2.qnu.repository;

import java.util.List;

import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.ServiceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceResultRepository extends JpaRepository<ServiceResult, String> {

        // Kiểm tra tồn tại
        boolean existsByPatient_PatientIdAndService_ServiceIdAndStatus(
                        String patientId,
                        String serviceId,
                        String status);

        // Lấy kết quả theo bệnh nhân
        List<ServiceResult> findByPatient_PatientIdAndStatus(String patientId, String status);

        // Lấy bệnh nhân có kết quả CLS
        // @Query("SELECT DISTINCT sr.patient FROM ServiceResult sr WHERE sr.status =
        // :status")
        // List<Patients> findDistinctPatientsByStatus(@Param("status") String status);

        @Query("SELECT DISTINCT sr.patient FROM ServiceResult sr WHERE LOWER(sr.status) = LOWER(:status)")
        List<Patients> findDistinctPatientsByStatus(@Param("status") String status);

        // Lấy bệnh nhân có kết quả CLS theo bác sĩ
        // @Query("SELECT DISTINCT sr.patient FROM ServiceResult sr " +
        // "WHERE sr.status = :status AND sr.doctor.doctorId = :doctorId")
        // List<Patients> findDistinctPatientsByStatusAndDoctor(
        // @Param("status") String status,
        // @Param("doctorId") String doctorId);

        @Query("SELECT DISTINCT sr.patient FROM ServiceResult sr WHERE LOWER(sr.status) = LOWER(:status) AND sr.doctor.doctorId = :doctorId")
        List<Patients> findDistinctPatientsByStatusAndDoctor(
                        @Param("status") String status,
                        @Param("doctorId") String doctorId);

}
