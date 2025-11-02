package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.EHealthRecords;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EHealthRecordsRepository extends JpaRepository<EHealthRecords, String> {

    EHealthRecords findByPatientPatientId(String patientId);
}
