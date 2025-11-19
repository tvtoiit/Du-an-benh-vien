package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.AdvancePayment;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.payload.request.AdvancePaymentRequest;
import com.nhom2.qnu.repository.AdvancePaymentRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.service.AdvancePaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

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
    @Transactional
    public AdvancePayment createAdvancePayment(AdvancePaymentRequest req) {
        Patients patient = patientsRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Patient not found with id: " + req.getPatientId()
                ));

        AdvancePayment ap = new AdvancePayment();
        ap.setPatient(patient);
        ap.setAmount(req.getAmount());
        ap.setNote(req.getNote());
        ap.setCreatedBy(req.getCreatedBy());
        ap.setCreatedAt(LocalDateTime.now());

        return advancePaymentRepository.save(ap);
    }

    @Override
    @Transactional
    public AdvancePayment updateAdvancePayment(String advanceId, AdvancePaymentRequest req) {
        AdvancePayment existing = advancePaymentRepository.findById(advanceId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "AdvancePayment not found with id: " + advanceId
                ));

        // update patient nếu có thay đổi
        if (req.getPatientId() != null && !req.getPatientId().isBlank()) {
            String newPatientId = req.getPatientId();
            String currentPatientId = existing.getPatient() != null ? existing.getPatient().getPatientId() : null;
            if (currentPatientId == null || !currentPatientId.equals(newPatientId)) {
                Patients patient = patientsRepository.findById(newPatientId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Patient not found with id: " + newPatientId
                        ));
                existing.setPatient(patient);
            }
        }

        if (req.getAmount() != null) {
            existing.setAmount(req.getAmount());
        }

        if (req.getNote() != null) {
            existing.setNote(req.getNote());
        }

        if (req.getCreatedBy() != null) {
            existing.setCreatedBy(req.getCreatedBy());
        }

        return advancePaymentRepository.save(existing);
    }
}