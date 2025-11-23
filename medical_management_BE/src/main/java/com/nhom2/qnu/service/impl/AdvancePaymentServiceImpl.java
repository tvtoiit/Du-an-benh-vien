package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.dto.PatientAdvanceDTO;
import com.nhom2.qnu.model.AdvancePayment;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.payload.request.AdvancePaymentRequest;
import com.nhom2.qnu.repository.AdvancePaymentRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.service.AdvancePaymentService;
import com.nhom2.qnu.dto.PatientAdvanceDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdvancePaymentServiceImpl implements AdvancePaymentService {

    private final AdvancePaymentRepository advancePaymentRepository;
    private final PatientsRepository patientsRepository;

    public AdvancePaymentServiceImpl(AdvancePaymentRepository advancePaymentRepository,
            PatientsRepository patientsRepository) {
        this.advancePaymentRepository = advancePaymentRepository;
        this.patientsRepository = patientsRepository;
    }

    @Override
    public AdvancePayment createAdvancePayment(AdvancePaymentRequest req) {
        // 1. Tìm bệnh nhân
        Patients patient = patientsRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patient not found with id: " + req.getPatientId()));

        // 2. Map request -> entity
        AdvancePayment ap = new AdvancePayment();
        ap.setPatient(patient);
        ap.setAmount(req.getAmount());
        ap.setNote(req.getNote());
        ap.setCreatedBy(req.getCreatedBy());
        ap.setCreatedAt(LocalDateTime.now());

        // 3. Lưu DB
        return advancePaymentRepository.save(ap);
    }

    @Override
    public AdvancePayment updateAdvancePayment(String advanceId, AdvancePaymentRequest req) {
        AdvancePayment existing = advancePaymentRepository.findById(advanceId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Advance payment not found with id: " + advanceId));

        // nếu bạn cho phép đổi bệnh nhân:
        if (req.getPatientId() != null) {
            Patients patient = patientsRepository.findById(req.getPatientId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Patient not found with id: " + req.getPatientId()));
            existing.setPatient(patient);
        }

        if (req.getAmount() != null)
            existing.setAmount(req.getAmount());
        if (req.getNote() != null)
            existing.setNote(req.getNote());
        if (req.getCreatedBy() != null)
            existing.setCreatedBy(req.getCreatedBy());

        return advancePaymentRepository.save(existing);
    }

    // helper: tổng tạm ứng theo bệnh nhân
    public Double getTotalAdvanceByPatient(String patientId) {
        Double sum = advancePaymentRepository.sumAmountByPatientId(patientId);
        return sum != null ? sum : 0.0;
    }

    public List<PatientAdvanceDTO> getPatientsForAdvance() {
        return advancePaymentRepository.findAllRegisteredPatients();
    }
}