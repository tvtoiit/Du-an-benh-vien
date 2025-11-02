package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Patients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentSchedules, String> {

    List<AppointmentSchedules> findAllByPatients(Patients patients);
    List<AppointmentSchedules> findAllByDoctor(Doctor doctor);

    @Query("SELECT COUNT(a) > 0 FROM AppointmentSchedules a WHERE a.patients = :patient AND a.appointmentDatetime = :appointmentDatetime")
    boolean existsByPatientsAndAppointmentDatetime(@Param("patient") Patients patient, @Param("appointmentDatetime") LocalDateTime appointmentDatetime);

    @Query("SELECT COUNT(a) > 0 FROM AppointmentSchedules a WHERE a.doctor = :doctor AND a.appointmentDatetime = :appointmentDatetime AND a.status ='Successful'")
    boolean existsByDoctorAndAppointmentDatetime(@Param("doctor") Doctor doctor, @Param("appointmentDatetime") LocalDateTime appointmentDatetime);
}
