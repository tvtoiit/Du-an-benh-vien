package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionHistory;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.payload.response.PaymentSummaryResponse;
import com.nhom2.qnu.repository.AdvancePaymentRepository;
import com.nhom2.qnu.repository.PaymentDetailsRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.PrescriptionHistoryRepository;
import com.nhom2.qnu.service.PaymentDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

    private static final long DEFAULT_EXAM_FEE = 100_000L; // tiền khám mặc định, bạn có thể đổi sau

    private final PaymentDetailsRepository paymentDetailsRepository;
    private final PatientsRepository patientsRepository;
    private final PrescriptionHistoryRepository prescriptionHistoryRepository;
    private final AdvancePaymentRepository advancePaymentRepository;
    private final JdbcTemplate jdbcTemplate;

    public PaymentDetailsServiceImpl(PaymentDetailsRepository paymentDetailsRepository,
                                     PatientsRepository patientsRepository,
                                     PrescriptionHistoryRepository prescriptionHistoryRepository,
                                     AdvancePaymentRepository advancePaymentRepository,
                                     JdbcTemplate jdbcTemplate) {
        this.paymentDetailsRepository = paymentDetailsRepository;
        this.patientsRepository = patientsRepository;
        this.prescriptionHistoryRepository = prescriptionHistoryRepository;
        this.advancePaymentRepository = advancePaymentRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Tạo PaymentDetails (hóa đơn) cho một bệnh nhân.
     * total_amount = examFee + serviceFee + medicineFee (chưa trừ tạm ứng).
     */
    @Override
    public PaymentDetails createPaymentDetails(PaymentDetailsRequest req) {
        // 1. Tìm bệnh nhân
        Patients patient = patientsRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patient not found with id: " + req.getPatientId()
                ));

        // 2. Nếu có prescriptionId thì load
        PrescriptionHistory prescription = null;
        if (req.getPrescriptionId() != null && !req.getPrescriptionId().isBlank()) {
            prescription = prescriptionHistoryRepository.findById(req.getPrescriptionId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Prescription not found with id: " + req.getPrescriptionId()
                    ));
        }

        // 3. Tính tiền khám/dịch vụ/thuốc (dùng cùng logic với getPaymentSummary)
        long examFee = DEFAULT_EXAM_FEE;
        BigDecimal servicesTotal = sumServicesForPatient(req.getPatientId());
        BigDecimal medicinesTotal = (prescription != null)
                ? sumMedicinesForPrescription(prescription.getPrescriptionId())
                : BigDecimal.ZERO;

        BigDecimal examFeeBd = BigDecimal.valueOf(examFee);
        BigDecimal totalAmount = examFeeBd.add(servicesTotal).add(medicinesTotal);

        // 4. Map vào entity
        PaymentDetails entity = new PaymentDetails();
        entity.setPatient(patient);
        entity.setPrescriptionHistory(prescription);
        entity.setTotal_amount(totalAmount);

        // 5. Lưu DB
        return paymentDetailsRepository.save(entity);
    }

    /**
     * Cập nhật PaymentDetails:
     * - Có thể đổi patient / prescription
     * - Tính lại total_amount theo dữ liệu mới nhất.
     */
    @Override
    public PaymentDetails updatePaymentDetails(String paymentDetailId, PaymentDetailsRequest req) {
        PaymentDetails existing = paymentDetailsRepository.findById(paymentDetailId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "PaymentDetails not found with id: " + paymentDetailId
                ));

        // 1. Cập nhật patient (nếu req truyền lên)
        if (req.getPatientId() != null && !req.getPatientId().isBlank()) {
            Patients patient = patientsRepository.findById(req.getPatientId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Patient not found with id: " + req.getPatientId()
                    ));
            existing.setPatient(patient);
        }

        // 2. Cập nhật prescription (nếu req truyền lên)
        if (req.getPrescriptionId() != null && !req.getPrescriptionId().isBlank()) {
            PrescriptionHistory prescription = prescriptionHistoryRepository.findById(req.getPrescriptionId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Prescription not found with id: " + req.getPrescriptionId()
                    ));
            existing.setPrescriptionHistory(prescription);
        }

        // 3. Tính lại total_amount dựa trên patient/prescription hiện tại của entity
        String patientIdToUse = existing.getPatient() != null
                ? existing.getPatient().getPatientId()
                : null;

        String prescriptionIdToUse = (existing.getPrescriptionHistory() != null)
                ? existing.getPrescriptionHistory().getPrescriptionId()
                : null;

        long examFee = DEFAULT_EXAM_FEE;
        BigDecimal servicesTotal = (patientIdToUse != null)
                ? sumServicesForPatient(patientIdToUse)
                : BigDecimal.ZERO;

        BigDecimal medicinesTotal = (prescriptionIdToUse != null)
                ? sumMedicinesForPrescription(prescriptionIdToUse)
                : BigDecimal.ZERO;

        BigDecimal examFeeBd = BigDecimal.valueOf(examFee);
        BigDecimal totalAmount = examFeeBd.add(servicesTotal).add(medicinesTotal);

        existing.setTotal_amount(totalAmount);

        return paymentDetailsRepository.save(existing);
    }

    /**
     * Tính summary cho màn hình thanh toán (FE PaymentForm).
     */
    @Override
    public PaymentSummaryResponse getPaymentSummary(String patientId, String prescriptionId) {

        Patients patient = patientsRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patient not found with id: " + patientId
                ));

        // 1. Tiền khám
        long examFee = DEFAULT_EXAM_FEE;

        // 2. Tiền dịch vụ CLS (từ tbl_patient_service + tbl_service)
        long serviceFee = sumServicesForPatient(patientId).longValue();

        // 3. Tiền thuốc
        long medicineFee = 0L;
        if (prescriptionId != null && !prescriptionId.isBlank()) {
            medicineFee = sumMedicinesForPrescription(prescriptionId).longValue();
        }

        // 4. Tổng tạm ứng (AdvancePayment)
        Double advance = advancePaymentRepository.sumAmountByPatientId(patientId);
        long advanceTotal = (advance != null) ? advance.longValue() : 0L;

        // 5. Tổng chi phí & số tiền cần trả thêm
        long totalCost = examFee + serviceFee + medicineFee;
        long amountToPay = Math.max(totalCost - advanceTotal, 0L);

        return PaymentSummaryResponse.builder()
                .patientId(patient.getPatientId())
                .fullName(patient.getUser().getFullName())
                .examFee(examFee)
                .serviceFee(serviceFee)
                .medicineFee(medicineFee)
                .advanceTotal(advanceTotal)
                .totalCost(totalCost)
                .amountToPay(amountToPay)
                .build();
    }

    /**
     * Sum tiền dịch vụ dựa trên:
     *  - tbl_patient_service(patient_id, service_id)
     *  - tbl_service(service_id, price)
     */
    private BigDecimal sumServicesForPatient(String patientId) {
        String sql =
                "SELECT COALESCE(SUM(s.price), 0) " +
                        "FROM tbl_patient_service ps " +
                        "JOIN tbl_service s ON ps.service_id = s.service_id " +
                        "WHERE ps.patient_id = ?";

        BigDecimal result = jdbcTemplate.queryForObject(sql, BigDecimal.class, patientId);
        return result != null ? result : BigDecimal.ZERO;
    }

    /**
     * Sum tiền thuốc cho một đơn kê (prescriptionId) dựa trên:
     *  - tbl_prescription_history (prescription_id, medicine_id)
     *  - tbl_medicines (medicine_id, price)
     *
     * Lưu ý: với schema hiện tại, mỗi prescription_id tương ứng 1 medicine_id,
     * nên SUM(m.price) thực tế chỉ là 1 dòng. Nếu sau này có bảng chi tiết toa,
     * bạn có thể chỉnh SQL cho phù hợp.
     */
    private BigDecimal sumMedicinesForPrescription(String prescriptionId) {
        String sql =
                "SELECT COALESCE(SUM(m.price), 0) " +
                        "FROM tbl_prescription_history ph " +
                        "JOIN tbl_medicines m ON ph.medicine_id = m.medicine_id " +
                        "WHERE ph.prescription_id = ?";

        BigDecimal result = jdbcTemplate.queryForObject(sql, BigDecimal.class, prescriptionId);
        return result != null ? result : BigDecimal.ZERO;
    }
    @Override
    public List<PaymentSummaryResponse> getWaitingPayments() {
        // ví dụ: tạm thời lấy tất cả bệnh nhân rồi map sang summary
        return patientsRepository.findAll()
                .stream()
                .map(p -> getPaymentSummary(p.getPatientId(), null))
                .collect(Collectors.toList());
    }

}
