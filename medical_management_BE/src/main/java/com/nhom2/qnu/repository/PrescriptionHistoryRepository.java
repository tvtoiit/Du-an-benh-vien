package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionHistory;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionHistoryRepository extends JpaRepository<PrescriptionHistory, String> {
    @Query("""
                SELECT DISTINCT p FROM PrescriptionHistory ph
                JOIN ph.patient p
            """)
    List<Patients> findPatientsWithPrescription();

    Optional<PrescriptionHistory> findTopByPatient_PatientIdOrderByPrescriptionIdDesc(String patientId);
}
