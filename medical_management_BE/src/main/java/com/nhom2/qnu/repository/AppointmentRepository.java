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

        // Thực hiện ứng tiền
        @Query("SELECT DISTINCT a.patients FROM AppointmentSchedules a")
        List<Patients> findAllRegisteredPatients();

        // update status tiến độ bệnh nhân hoàn thành để, thanh toán
        Optional<AppointmentSchedules> findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(String patientId);

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

}
