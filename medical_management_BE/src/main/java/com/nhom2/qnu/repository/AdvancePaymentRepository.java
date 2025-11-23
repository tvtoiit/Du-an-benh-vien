package com.nhom2.qnu.repository;

import com.nhom2.qnu.dto.PatientAdvanceDTO;
import com.nhom2.qnu.model.AdvancePayment;
import com.nhom2.qnu.model.Patients;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AdvancePaymentRepository extends JpaRepository<AdvancePayment, String> {
    @Query("SELECT COALESCE(SUM(a.amount), 0) FROM AdvancePayment a WHERE a.patient.patientId = :patientId")
    Double sumAmountByPatientId(@Param("patientId") String patientId);

    @Query("""
                SELECT new com.nhom2.qnu.dto.PatientAdvanceDTO(
                    p.patientId,
                    u.fullName,
                    u.phoneNumber,
                    u.address,
                    COALESCE(SUM(ap.amount), 0)
                )
                FROM Patients p
                JOIN p.user u
                JOIN AppointmentSchedules a ON a.patients = p
                LEFT JOIN AdvancePayment ap ON ap.patient = p
                GROUP BY p.patientId, u.fullName, u.phoneNumber, u.address
            """)
    List<PatientAdvanceDTO> findAllRegisteredPatients();

}
