package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.AdvancePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AdvancePaymentRepository extends JpaRepository<AdvancePayment, String> {
    @Query("SELECT COALESCE(SUM(a.amount), 0) FROM AdvancePayment a WHERE a.patient.patientId = :patientId")
    Double sumAmountByPatientId(@Param("patientId") String patientId);
}
