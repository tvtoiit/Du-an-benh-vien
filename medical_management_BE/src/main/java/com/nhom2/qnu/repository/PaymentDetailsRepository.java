package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.payload.response.PatientPaymentResponse;
import com.nhom2.qnu.payload.response.RevenueReportResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, String> {

    // Lấy danh sách hóa đơn theo 1 bệnh nhân
    List<PaymentDetails> findByPatient(Patients patient);

    // Lấy hóa đơn theo từng lần khám
    List<PaymentDetails> findByAppointment(AppointmentSchedules appointment);

    // Kiểm tra xem một lần khám đã được thanh toán hay chưa
    boolean existsByAppointment_AppointmentScheduleId(String appointmentId);

    // Kiểm tra đơn thuốc đã được thanh toán hay chưa
    boolean existsByPrescriptionHistory_PrescriptionId(String prescriptionId);

    // Danh sách bệnh nhân đã khám xong (Hoàn thành) và chờ thanh toán
    @Query("""
            SELECT new com.nhom2.qnu.payload.response.PatientPaymentResponse(
                p.patientId,
                u.fullName,
                u.phoneNumber,
                u.dateOfBirth,
                a.status
            )
            FROM AppointmentSchedules a
            JOIN a.patients p
            JOIN p.user u
            WHERE a.status IN ('Đã kết luận', 'Đã kê đơn', 'Đã thanh toán')
            """)
    List<PatientPaymentResponse> findPatientsReadyForPayment();

    // Báo cáo doanh thu theo tháng
    @Query("""
            SELECT new com.nhom2.qnu.payload.response.RevenueReportResponse(
                FUNCTION('DATE_FORMAT', pd.createdAt, '%Y-%m'),
                SUM(pd.totalAmount)
            )
            FROM PaymentDetails pd
            GROUP BY FUNCTION('DATE_FORMAT', pd.createdAt, '%Y-%m')
            ORDER BY FUNCTION('DATE_FORMAT', pd.createdAt, '%Y-%m')
            """)
    List<RevenueReportResponse> getMonthlyRevenue();
}
