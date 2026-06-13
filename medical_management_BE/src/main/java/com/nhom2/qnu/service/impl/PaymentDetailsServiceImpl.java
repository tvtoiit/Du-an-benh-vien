package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionHistory;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.payload.response.PatientPaymentResponse;
import com.nhom2.qnu.payload.response.PaymentSuccessResponse;
import com.nhom2.qnu.payload.response.PaymentSummaryResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.PaymentDetailsRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.PrescriptionHistoryRepository;
import com.nhom2.qnu.service.PaymentDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

        @Autowired
        private PaymentDetailsRepository paymentDetailsRepository;

        @Autowired
        private PatientsRepository patientsRepository;

        @Autowired
        private PrescriptionHistoryRepository prescriptionHistoryRepository;

        @Autowired
        private AppointmentRepository appointmentRepository;

        @Autowired
        private JdbcTemplate jdbcTemplate;

        /**
         * Tạo hóa đơn cho MỘT LẦN KHÁM (appointment)
         */
        @Override
        public PaymentSuccessResponse createPaymentDetails(PaymentDetailsRequest req) {

                // 1. Bệnh nhân
                Patients patient = patientsRepository.findById(req.getPatientId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Patient not found"));

                // 2. Lần khám
                AppointmentSchedules appointment = appointmentRepository.findById(req.getAppointmentId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Appointment not found"));

                // 3. Check đã có hóa đơn chưa
                String status = appointment.getStatus();
                if (!"Chờ thanh toán".equalsIgnoreCase(status)
                                && !"Chờ thanh toán CLS".equalsIgnoreCase(status)) {

                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Lần khám không ở trạng thái thanh toán");
                }

                // 4. Đơn thuốc (nếu có)
                Optional<PrescriptionHistory> prescriptionOpt = prescriptionHistoryRepository
                                .findFirstByAppointment(appointment);
                PrescriptionHistory prescription = prescriptionOpt.orElse(null);

                // 5. Tính phí khám bác sĩ
                BigDecimal consultationFee = BigDecimal.ZERO;

                Doctor doctor = appointment.getDoctor();

                if (doctor != null && doctor.getConsultationFee() != null) {
                        consultationFee = doctor.getConsultationFee();
                }

                // 6. Tính phí dịch vụ
                BigDecimal serviceFee = sumServicesForAppointment(
                                appointment.getAppointmentScheduleId());

                // 7. Tổng tiền

                BigDecimal total;

                if ("Chờ thanh toán".equalsIgnoreCase(status)) {

                        total = consultationFee;

                        appointment.setStatus("Chờ khám");

                } else if ("Chờ thanh toán CLS".equalsIgnoreCase(status)) {

                        total = serviceFee;

                        appointment.setStatus("Chờ CLS");

                } else {

                        throw new RuntimeException("Trạng thái thanh toán không hợp lệ");
                }

                // 8. Tạo bill
                PaymentDetails bill = new PaymentDetails();
                bill.setPatient(patient);
                bill.setAppointment(appointment);
                bill.setPrescriptionHistory(prescription);
                bill.setTotalAmount(total);

                PaymentDetails saved = paymentDetailsRepository.save(bill);

                appointmentRepository.save(appointment);

                return PaymentSuccessResponse.builder()
                                .paymentDetailId(saved.getPaymentDetailId())
                                .totalAmount(saved.getTotalAmount())
                                .status("SUCCESS")
                                .build();
        }

        /**
         * Cập nhật PaymentDetails: tính lại tổng tiền dựa trên appointment/prescription
         * mới.
         */
        @Override
        public PaymentDetails updatePaymentDetails(String paymentDetailId, PaymentDetailsRequest req) {

                PaymentDetails existing = paymentDetailsRepository.findById(paymentDetailId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "PaymentDetails not found with id: " + paymentDetailId));

                // Nếu FE muốn đổi patient
                if (req.getPatientId() != null && !req.getPatientId().isBlank()) {
                        Patients patient = patientsRepository.findById(req.getPatientId())
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Patient not found"));
                        existing.setPatient(patient);
                }

                // Nếu FE muốn đổi appointment
                AppointmentSchedules appointment = existing.getAppointment();
                if (req.getAppointmentId() != null && !req.getAppointmentId().isBlank()) {
                        appointment = appointmentRepository.findById(req.getAppointmentId())
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Appointment not found"));
                        existing.setAppointment(appointment);
                }

                // Xử lý prescription
                PrescriptionHistory prescription = null;
                if (req.getPrescriptionId() != null && !req.getPrescriptionId().isBlank()) {
                        prescription = prescriptionHistoryRepository.findById(req.getPrescriptionId())
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Prescription not found with id: " + req.getPrescriptionId()));
                } else if (appointment != null) {
                        prescription = prescriptionHistoryRepository.findFirstByAppointment(appointment)
                                        .orElse(null);
                }
                existing.setPrescriptionHistory(prescription);

                BigDecimal serviceFee = (appointment != null)
                                ? sumServicesForAppointment(
                                                appointment.getAppointmentScheduleId())
                                : BigDecimal.ZERO;

                BigDecimal total = serviceFee;

                existing.setTotalAmount(total);

                return paymentDetailsRepository.save(existing);
        }

        /**
         * Danh sách bệnh nhân chờ thanh toán (đơn giản: tất cả appointment "Hoàn thành"
         * nhưng chưa có PaymentDetails).
         */
        @Override
        public List<PaymentSummaryResponse> getWaitingPayments() {

                List<AppointmentSchedules> waitingAppointments = appointmentRepository.findAll().stream()
                                .filter(a -> "Chờ thanh toán".equalsIgnoreCase(a.getStatus())
                                                || "Chờ thanh toán CLS".equalsIgnoreCase(a.getStatus()))
                                .toList();

                return waitingAppointments.stream()
                                .map(a -> getPaymentSummary(
                                                a.getAppointmentScheduleId()))
                                .collect(Collectors.toList());
        }

        @Override
        public PaymentSummaryResponse getPaymentSummary(String appointmentId) {
                // 1. Lấy lần khám
                AppointmentSchedules appointment = appointmentRepository
                                .findById(appointmentId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy lần khám"));

                // 2. Lấy bệnh nhân từ lần khám
                Patients patient = appointment.getPatients();

                // 3. Lấy bác sĩ
                Doctor doctor = appointment.getDoctor();

                String doctorName = "";
                String roomName = "";
                String roomGroupName = "";

                if (doctor != null) {

                        if (doctor.getUser() != null) {
                                doctorName = doctor.getUser().getFullName();
                        }

                        if (doctor.getRoom() != null) {

                                roomName = doctor.getRoom().getRoomName();

                                if (doctor.getRoom().getRoomGroup() != null) {

                                        roomGroupName = doctor.getRoom()
                                                        .getRoomGroup()
                                                        .getGroupName();
                                }
                        }
                }

                // 4. Tính phí CLS
                long serviceFee = sumServicesForAppointment(
                                appointment.getAppointmentScheduleId())
                                .longValue();

                // 5. Tính phí khám
                long consultationFee = 0L;

                if (doctor != null && doctor.getConsultationFee() != null) {

                        consultationFee = doctor.getConsultationFee().longValue();
                }

                // 6. Xử lý theo trạng thái
                String status = appointment.getStatus();

                long totalCost = 0L;

                if ("Chờ thanh toán".equalsIgnoreCase(status)) {

                        // Chỉ thu phí khám
                        serviceFee = 0L;
                        totalCost = consultationFee;

                } else if ("Chờ thanh toán CLS".equalsIgnoreCase(status)) {

                        // Chỉ thu CLS
                        consultationFee = 0L;
                        totalCost = serviceFee;

                } else {

                        totalCost = consultationFee + serviceFee;
                }

                // 7. Trả response
                return PaymentSummaryResponse.builder()
                                .patientId(patient.getPatientId())
                                .appointmentId(appointment.getAppointmentScheduleId())

                                .fullName(patient.getUser().getFullName())
                                .cccd(patient.getUser().getCcCongDan())

                                .status(status)

                                .consultationFee(consultationFee)
                                .serviceFee(serviceFee)
                                .totalCost(totalCost)

                                .doctorName(doctorName)
                                .roomName(roomName)
                                .roomGroupName(roomGroupName)

                                .build();

        }

        @Override
        public List<PaymentSummaryResponse> getPatientsForPayment() {

                // Lấy danh sách bệnh nhân đủ điều kiện thanh toán
                List<PatientPaymentResponse> rawList = paymentDetailsRepository.findPatientsReadyForPayment();

                return rawList.stream()
                                .map(item -> getPaymentSummary(
                                                item.getAppointmentId()))
                                .toList();
        }

        // ================== HÀM HỖ TRỢ ==================

        /**
         * SUM tiền dịch vụ theo bảng tbl_appointment_service
         */
        private BigDecimal sumServicesForAppointment(String appointmentId) {

                String sql = """
                                SELECT COALESCE(SUM(s.price), 0)
                                FROM tbl_appointment_service aps
                                JOIN tbl_service s ON aps.service_id = s.service_id
                                WHERE aps.appointment_id = ?
                                """;

                BigDecimal result = jdbcTemplate.queryForObject(sql, BigDecimal.class, appointmentId);
                return (result != null) ? result : BigDecimal.ZERO;
        }

}
