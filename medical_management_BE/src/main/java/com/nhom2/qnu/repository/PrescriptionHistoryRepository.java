package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionHistory;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.MedicalHistories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionHistoryRepository extends JpaRepository<PrescriptionHistory, String> {

    // Lấy tất cả đơn thuốc của bệnh nhân
    List<PrescriptionHistory> findByPatient(Patients patient);

    // Lấy đơn thuốc theo từng lần khám
    List<PrescriptionHistory> findByAppointment(AppointmentSchedules appointment);

    // ⭐ Lấy đơn thuốc ĐẦU TIÊN của lần khám (cần cho PaymentDetails)
    Optional<PrescriptionHistory> findFirstByAppointment(AppointmentSchedules appointment);

    // Kiểm tra bệnh nhân đã kê đơn trong lần khám này hay chưa
    boolean existsByPatient_PatientIdAndAppointment_AppointmentScheduleId(
            String patientId,
            String appointmentId);

    // Lấy đơn thuốc mới nhất theo bệnh nhân
    Optional<PrescriptionHistory> findTopByPatient_PatientIdOrderByPrescriptionIdDesc(String patientId);

    // Lấy danh sách bệnh nhân đã có kê đơn
    @Query("SELECT DISTINCT ph.patient FROM PrescriptionHistory ph")
    List<Patients> findPatientsWithPrescription();

    // Lấy đơn thuốc theo hồ sơ bệnh án
    // List<PrescriptionHistory> findByMedicalHistory(MedicalHistories
    // medicalHistory);

}
