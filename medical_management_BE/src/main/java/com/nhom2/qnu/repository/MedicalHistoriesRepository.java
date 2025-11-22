package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.MedicalHistories;
import com.nhom2.qnu.model.Patients;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalHistoriesRepository extends JpaRepository<MedicalHistories, String> {
    @Query("""
                SELECT DISTINCT er.patient
                FROM EHealthRecords er
                JOIN er.medicalHistories mh
                ORDER BY mh.dischargeDate DESC
            """)
    List<Patients> findPatientsWithConclusion();

}
