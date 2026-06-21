package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.payload.response.VisitReportResponse;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentSchedules, String> {

        List<AppointmentSchedules> findAllByPatients(Patients patients);

        List<AppointmentSchedules> findAllByDoctor(Doctor doctor);

        List<AppointmentSchedules> findAllByStatus(String status);

        List<AppointmentSchedules> findAllByDoctorAndStatus(Doctor doctor, String status);

        @Query("SELECT COUNT(a) > 0 FROM AppointmentSchedules a WHERE a.patients = :patient AND a.appointmentDatetime = :appointmentDatetime")
        boolean existsByPatientsAndAppointmentDatetime(@Param("patient") Patients patient,
                        @Param("appointmentDatetime") LocalDateTime appointmentDatetime);

        @Query("SELECT COUNT(a) > 0 FROM AppointmentSchedules a WHERE a.doctor = :doctor AND a.appointmentDatetime = :appointmentDatetime AND a.status ='Successful'")
        boolean existsByDoctorAndAppointmentDatetime(@Param("doctor") Doctor doctor,
                        @Param("appointmentDatetime") LocalDateTime appointmentDatetime);

        // Lấy danh sách bệnh nhân từng đăng ký khám
        @Query("SELECT DISTINCT a.patients FROM AppointmentSchedules a")
        List<Patients> findAllRegisteredPatients();

        // Lấy lịch khám gần nhất theo patientId (trả Optional)
        Optional<AppointmentSchedules> findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(String patientId);

        // 👉 Thêm method còn thiếu — cực kỳ quan trọng
        // AppointmentSchedules
        // findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(Patients patients);

        // Tìm lịch khám theo trạng thái
        List<AppointmentSchedules> findByPatients_PatientIdAndStatus(String patientId, String status);

        // Thống kê
        @Query("""
                        SELECT new com.nhom2.qnu.payload.response.VisitReportResponse(
                            FUNCTION('DATE', a.appointmentDatetime),
                            COUNT(a)
                        )
                        FROM AppointmentSchedules a
                        GROUP BY FUNCTION('DATE', a.appointmentDatetime)
                        ORDER BY FUNCTION('DATE', a.appointmentDatetime)
                        """)
        List<VisitReportResponse> getDailyVisits();

        // lấy danh sách bệnh nhân đã thanh toán
        @Query("""
                        SELECT DISTINCT a.patients
                        FROM AppointmentSchedules a
                        WHERE a.status = 'Đã thanh toán'
                        """)
        List<Patients> findPatientsWithPaidStatus();

}
