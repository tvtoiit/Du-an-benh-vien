package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.payload.response.PatientPaymentResponse;
import com.nhom2.qnu.payload.response.RevenueReportResponse;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, String> {
    @Query("""
                SELECT new com.nhom2.qnu.payload.response.PatientPaymentResponse(
                    p.patientId,
                    u.fullName,
                    u.phoneNumber,
                    p.dateOfBirth,
                    a.status
                )
                FROM AppointmentSchedules a
                JOIN a.patients p
                JOIN p.user u
                WHERE a.status = 'Hoàn thành'
            """)
    List<PatientPaymentResponse> findPatientsReadyForPayment();

    @Query("""
                SELECT new com.nhom2.qnu.payload.response.RevenueReportResponse(
                    FUNCTION('DATE_FORMAT', p.createdAt, '%Y-%m'),
                    SUM(p.total_amount)
                )
                FROM PaymentDetails p
                GROUP BY FUNCTION('DATE_FORMAT', p.createdAt, '%Y-%m')
                ORDER BY FUNCTION('DATE_FORMAT', p.createdAt, '%Y-%m')
            """)
    List<RevenueReportResponse> getMonthlyRevenue();
}
