package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionHistory;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.payload.response.PatientPaymentResponse;
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

        private static final long DEFAULT_EXAM_FEE = 100_000L;

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
        public PaymentDetails createPaymentDetails(PaymentDetailsRequest req) {

                // 1. Bệnh nhân
                Patients patient = patientsRepository.findById(req.getPatientId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Patient not found"));

                // 2. Lần khám
                AppointmentSchedules appointment = appointmentRepository.findById(req.getAppointmentId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Appointment not found"));

                // 3. Check đã có hóa đơn chưa
                boolean exists = paymentDetailsRepository
                                .existsByAppointment_AppointmentScheduleId(appointment.getAppointmentScheduleId());
                if (exists) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Lần khám này đã được thanh toán");
                }

                // 4. Đơn thuốc (nếu có)
                Optional<PrescriptionHistory> prescriptionOpt = prescriptionHistoryRepository
                                .findFirstByAppointment(appointment);
                PrescriptionHistory prescription = prescriptionOpt.orElse(null);

                // 5. Tính tiền
                BigDecimal examFee = BigDecimal.valueOf(DEFAULT_EXAM_FEE);
                BigDecimal serviceFee = sumServicesForAppointment(appointment.getAppointmentScheduleId());
                BigDecimal medicineFee = (prescription != null)
                                ? sumMedicinesForPrescription(prescription.getPrescriptionId())
                                : BigDecimal.ZERO;

                BigDecimal total = examFee.add(serviceFee).add(medicineFee);

                // 6. Tạo bill
                PaymentDetails bill = new PaymentDetails();
                bill.setPatient(patient);
                bill.setAppointment(appointment);
                bill.setPrescriptionHistory(prescription);
                bill.setTotalAmount(total);

                PaymentDetails saved = paymentDetailsRepository.save(bill);

                // 7. Update status lần khám
                appointment.setStatus("Đã thanh toán");
                appointmentRepository.save(appointment);

                return saved;
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

                // Tính lại tổng tiền
                BigDecimal examFee = BigDecimal.valueOf(DEFAULT_EXAM_FEE);
                BigDecimal serviceFee = (appointment != null)
                                ? sumServicesForAppointment(appointment.getAppointmentScheduleId())
                                : BigDecimal.ZERO;
                BigDecimal medicineFee = (prescription != null)
                                ? sumMedicinesForPrescription(prescription.getPrescriptionId())
                                : BigDecimal.ZERO;

                BigDecimal total = examFee.add(serviceFee).add(medicineFee);
                existing.setTotalAmount(total);

                return paymentDetailsRepository.save(existing);
        }

        /**
         * Danh sách bệnh nhân chờ thanh toán (đơn giản: tất cả appointment "Hoàn thành"
         * nhưng chưa có PaymentDetails).
         */
        @Override
        public List<PaymentSummaryResponse> getWaitingPayments() {

                // Tìm các lần khám "Hoàn thành"
                List<AppointmentSchedules> finishedAppointments = appointmentRepository.findAllByStatus("Hoàn thành");

                // Chỉ lấy những lần khám chưa có bill
                List<AppointmentSchedules> waiting = finishedAppointments.stream()
                                .filter(a -> !paymentDetailsRepository
                                                .existsByAppointment_AppointmentScheduleId(
                                                                a.getAppointmentScheduleId()))
                                .collect(Collectors.toList());

                return waiting.stream()
                                .map(a -> {
                                        String patientId = a.getPatients().getPatientId();
                                        // summary theo bệnh nhân + lần khám
                                        return getPaymentSummary(patientId, null);
                                })
                                .collect(Collectors.toList());
        }

        @Override
        public PaymentSummaryResponse getPaymentSummary(String patientId, String prescriptionId) {

                // 1️⃣ Lấy thông tin bệnh nhân
                Patients patient = patientsRepository.findById(patientId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Patient not found"));

                // 2️⃣ Lấy lần khám gần nhất
                AppointmentSchedules latestAppointment = appointmentRepository
                                .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(patientId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "No appointment found for patient"));

                String appointmentId = latestAppointment.getAppointmentScheduleId();

                // 3️⃣ Tính tiền khám (cố định)
                long examFee = DEFAULT_EXAM_FEE;

                // 4️⃣ Tính tiền dịch vụ
                long serviceFee = sumServicesForAppointment(appointmentId).longValue();

                // 5️⃣ Xác định đơn thuốc
                if (prescriptionId == null || prescriptionId.isBlank()) {
                        prescriptionId = prescriptionHistoryRepository
                                        .findFirstByAppointment(latestAppointment)
                                        .map(PrescriptionHistory::getPrescriptionId)
                                        .orElse(null);
                }

                // 6️⃣ Tính tiền thuốc
                long medicineFee = 0L;
                if (prescriptionId != null) {
                        medicineFee = sumMedicinesForPrescription(prescriptionId).longValue();
                }

                // 7️⃣ Tính tổng chi phí
                long totalCost = examFee + serviceFee + medicineFee;

                // 8️⃣ Lấy tổng số tiền tạm ứng
                long advanceTotal = sumAdvanceForAppointment(appointmentId).longValue();

                // 9️⃣ Tính tiền cần thu thêm
                long amountToPay = Math.max(totalCost - advanceTotal, 0);

                // 🔟 Xác định trạng thái hiển thị
                String rawStatus = latestAppointment.getStatus();
                String paymentStatus;

                if ("Đã kết luận".equalsIgnoreCase(rawStatus) ||
                                "Đã kê đơn".equalsIgnoreCase(rawStatus)) {

                        paymentStatus = "Chưa thanh toán";

                } else {
                        paymentStatus = rawStatus;
                }

                // Trả về response đầy đủ
                return PaymentSummaryResponse.builder()
                                .patientId(patient.getPatientId())
                                .fullName(patient.getUser().getFullName())
                                .cccd(patient.getUser().getCcCongDan())
                                .status(paymentStatus)
                                .appointmentId(appointmentId)

                                .examFee(examFee)
                                .serviceFee(serviceFee)
                                .medicineFee(medicineFee)

                                .advanceTotal(advanceTotal)
                                .totalCost(totalCost)
                                .amountToPay(amountToPay)
                                .build();
        }

        @Override
        public List<PaymentSummaryResponse> getPatientsForPayment() {

                // Lấy danh sách bệnh nhân đủ điều kiện thanh toán
                List<PatientPaymentResponse> rawList = paymentDetailsRepository.findPatientsReadyForPayment();

                return rawList.stream().map(item -> {

                        // lấy appointment gần nhất
                        AppointmentSchedules latestAppt = appointmentRepository
                                        .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(item.getPatientId())
                                        .orElse(null);

                        if (latestAppt == null)
                                return null;

                        // lấy prescription tương ứng lần khám
                        String prescriptionId = prescriptionHistoryRepository
                                        .findFirstByAppointment(latestAppt)
                                        .map(PrescriptionHistory::getPrescriptionId)
                                        .orElse(null);

                        PaymentSummaryResponse summary = getPaymentSummary(item.getPatientId(), prescriptionId);

                        // xử lý trạng thái hiển thị
                        String rawStatus = latestAppt.getStatus();
                        String paymentStatus;

                        if ("Đã kết luận".equalsIgnoreCase(rawStatus) ||
                                        "Đã kê đơn".equalsIgnoreCase(rawStatus)) {

                                paymentStatus = "Chưa thanh toán";

                        } else {
                                paymentStatus = rawStatus;
                        }

                        summary.setStatus(paymentStatus);

                        return summary;

                }).filter(x -> x != null).toList();
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

        /**
         * SUM tiền thuốc theo prescription (theo schema hiện tại của bạn)
         */
        private BigDecimal sumMedicinesForPrescription(String prescriptionId) {

                String sql = """
                                    SELECT COALESCE(SUM(m.price * pd.quantity), 0)
                                    FROM tbl_prescription_detail pd
                                    JOIN tbl_medicines m ON pd.medicine_id = m.medicine_id
                                    WHERE pd.prescription_id = ?
                                """;

                BigDecimal result = jdbcTemplate.queryForObject(sql, BigDecimal.class, prescriptionId);
                return (result != null) ? result : BigDecimal.ZERO;
        }

        private BigDecimal sumAdvanceForAppointment(String appointmentId) {

                String sql = """
                                    SELECT COALESCE(SUM(ap.amount), 0)
                                    FROM tbl_advance_payment ap
                                    WHERE ap.appointment_id = ?
                                """;

                BigDecimal result = jdbcTemplate.queryForObject(sql, BigDecimal.class, appointmentId);
                return (result != null) ? result : BigDecimal.ZERO;
        }

}
