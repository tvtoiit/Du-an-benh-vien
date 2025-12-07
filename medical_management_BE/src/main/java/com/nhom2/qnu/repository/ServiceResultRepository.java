package com.nhom2.qnu.repository;

import java.util.List;

import com.nhom2.qnu.model.MedicalHistories;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.ServiceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceResultRepository extends JpaRepository<ServiceResult, String> {

  // -----------------------------------------
  // 1) Kiểm tra tồn tại kết quả
  // -----------------------------------------
  boolean existsByPatient_PatientIdAndService_ServiceIdAndStatus(
      String patientId,
      String serviceId,
      String status);

  // -----------------------------------------
  // 2) Lấy kết quả theo bệnh nhân & trạng thái
  // -----------------------------------------
  List<ServiceResult> findByPatient_PatientIdAndStatus(String patientId, String status);

  // -----------------------------------------
  // 3) Lấy danh sách bệnh nhân có kết quả theo trạng thái
  // -----------------------------------------
  @Query("SELECT DISTINCT sr.patient FROM ServiceResult sr WHERE LOWER(sr.status) = LOWER(:status)")
  List<Patients> findDistinctPatientsByStatus(@Param("status") String status);

  // -----------------------------------------
  // 4) Lấy bệnh nhân có kết quả CLS theo bác sĩ
  // -----------------------------------------
  @Query("""
      SELECT DISTINCT sr.patient
      FROM ServiceResult sr
      WHERE LOWER(sr.status) = LOWER(:status)
        AND sr.doctor.doctorId = :doctorId
      """)
  List<Patients> findDistinctPatientsByStatusAndDoctor(
      @Param("status") String status,
      @Param("doctorId") String doctorId);

  // -----------------------------------------
  // 5) Lấy kết quả theo hồ sơ khám
  // -----------------------------------------
  List<ServiceResult> findByMedicalHistory(MedicalHistories medicalHistory);

  // -----------------------------------------
  // 6) Lấy tất cả kết quả thuộc 1 lịch khám (phục vụ cập nhật trạng thái
  // Appointment)
  // -----------------------------------------
  List<ServiceResult> findAllByAppointmentSchedule_AppointmentScheduleId(String appointmentScheduleId);

  boolean existsByAppointmentSchedule_AppointmentScheduleIdAndService_ServiceIdAndStatus(
      String appointmentId, String serviceId, String status);

}
