package com.nhom2.qnu.service.impl;

;import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionHistory;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
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
import java.util.Optional;

@Service
public class PaymentDetailsServiceImpl implements PaymentDetailsService {

    private final PaymentDetailsRepository paymentDetailsRepository;
    private final PatientsRepository patientsRepository;
    private final PrescriptionHistoryRepository prescriptionHistoryRepository;
    private final JdbcTemplate jdbcTemplate;

    public PaymentDetailsServiceImpl(PaymentDetailsRepository paymentDetailsRepository,
                                     PatientsRepository patientsRepository,
                                     PrescriptionHistoryRepository prescriptionHistoryRepository,
                                     JdbcTemplate jdbcTemplate) {
        this.paymentDetailsRepository = paymentDetailsRepository;
        this.patientsRepository = patientsRepository;
        this.prescriptionHistoryRepository = prescriptionHistoryRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public PaymentDetails createPaymentDetails(PaymentDetailsRequest req) {
        // validate patient exists
        Patients patient = patientsRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Patient not found with id: " + req.getPatientId()));

        // optional prescription
        PrescriptionHistory prescription = null;
        if (req.getPrescriptionId() != null && !req.getPrescriptionId().isBlank()) {
            prescription = prescriptionHistoryRepository.findById(req.getPrescriptionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Prescription not found with id: " + req.getPrescriptionId()));
        }

        // compute totals
        BigDecimal servicesTotal = sumServicesForPatient(req.getPatientId());
        BigDecimal medicinesTotal = BigDecimal.ZERO;
        if (prescription != null) {
            medicinesTotal = sumMedicinesForPrescription(req.getPrescriptionId());
        }

        BigDecimal total = servicesTotal.add(medicinesTotal);

        // prepare entity and save
        PaymentDetails pd = new PaymentDetails();
        pd.setPatient(patient);
        pd.setPrescriptionHistory(prescription);
        pd.setTotal_amount(total);

        return paymentDetailsRepository.save(pd);
    }

    @Override
    @Transactional
    public PaymentDetails updatePaymentDetails(String paymentDetailId, PaymentDetailsRequest req) {
        PaymentDetails existing = paymentDetailsRepository.findById(paymentDetailId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "PaymentDetails not found with id: " + paymentDetailId));

        // update patient if provided
        if (req.getPatientId() != null && !req.getPatientId().isBlank()) {
            Patients patient = patientsRepository.findById(req.getPatientId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Patient not found with id: " + req.getPatientId()));
            existing.setPatient(patient);
        }

        // update prescription if provided
        PrescriptionHistory prescription = null;
        if (req.getPrescriptionId() != null && !req.getPrescriptionId().isBlank()) {
            prescription = prescriptionHistoryRepository.findById(req.getPrescriptionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Prescription not found with id: " + req.getPrescriptionId()));
            existing.setPrescriptionHistory(prescription);
        }

        // recompute totals using current patient/prescription on entity
        String patientIdToUse = existing.getPatient() != null ? existing.getPatient().getPatientId() : null;
        String prescriptionIdToUse = existing.getPrescriptionHistory() != null ? existing.getPrescriptionHistory().getPrescriptionId() : null;

        BigDecimal servicesTotal = patientIdToUse != null ? sumServicesForPatient(patientIdToUse) : BigDecimal.ZERO;
        BigDecimal medicinesTotal = prescriptionIdToUse != null ? sumMedicinesForPrescription(prescriptionIdToUse) : BigDecimal.ZERO;
        existing.setTotal_amount(servicesTotal.add(medicinesTotal));

        return paymentDetailsRepository.save(existing);
    }

    /**
     * Sum giá các service của patient từ bảng tbl_patient_service JOIN tbl_service
     */
    private BigDecimal sumServicesForPatient(String patientId) {
        try {
            String sql = "SELECT COALESCE(SUM(s.price), 0) " +
                    "FROM tbl_patient_service ps " +
                    "JOIN tbl_service s ON ps.service_id = s.service_id " +
                    "WHERE ps.patient_id = ?";
            Double result = jdbcTemplate.queryForObject(sql, new Object[]{patientId}, Double.class);
            return result == null ? BigDecimal.ZERO : BigDecimal.valueOf(result);
        } catch (Exception ex) {
            // nếu bảng/column khác tên, log và trả 0
            // bạn có thể thay bằng logger nếu project có logging
            System.err.println("sumServicesForPatient error: " + ex.getMessage());
            return BigDecimal.ZERO;
        }
    }

    /**
     * Sum tiền thuốc cho prescription.
     *
     * Cố gắng dùng bảng tbl_prescription_item nếu có (cột quantity và unit_price hoặc lấy giá từ tbl_medicines).
     * Nếu không có, fallback: trả 0 (hoặc bạn có thể chỉnh SQL phù hợp với schema bạn dùng).
     */
    private BigDecimal sumMedicinesForPrescription(String prescriptionId) {
        // 1) thử bảng tbl_prescription_item (thường có prescription_id, medicine_id, quantity, unit_price)
        try {
            String sqlItem = "SELECT COALESCE(SUM( (CASE WHEN pi.unit_price IS NOT NULL THEN pi.unit_price ELSE m.price END) * pi.quantity ), 0) " +
                    "FROM tbl_prescription_item pi " +
                    "LEFT JOIN tbl_medicines m ON pi.medicine_id = m.medicine_id " +
                    "WHERE pi.prescription_id = ?";
            Double result = jdbcTemplate.queryForObject(sqlItem, new Object[]{prescriptionId}, Double.class);
            if (result != null && result > 0) {
                return BigDecimal.valueOf(result);
            }
        } catch (Exception ex) {
            // bảng không tồn tại hoặc column khác tên -> tiếp fallback
            System.err.println("sumMedicinesForPrescription (item) error: " + ex.getMessage());
        }

        // 2) fallback: nếu bạn có tiền thuốc trực tiếp trong tbl_prescription_history (ví dụ cột total_amount),
        //    thử lấy nó:
        try {
            String sqlFallback = "SELECT COALESCE(ph.total_amount, 0) FROM tbl_prescription_history ph WHERE ph.prescription_id = ?";
            Double result = jdbcTemplate.queryForObject(sqlFallback, new Object[]{prescriptionId}, Double.class);
            if (result != null) {
                return BigDecimal.valueOf(result);
            }
        } catch (Exception ex) {
            System.err.println("sumMedicinesForPrescription (fallback) error: " + ex.getMessage());
        }

        // nếu không tìm được cấu trúc dữ liệu phù hợp thì trả 0 — bạn có thể chỉnh lại SQL cho đúng schema
        return BigDecimal.ZERO;
    }
}
