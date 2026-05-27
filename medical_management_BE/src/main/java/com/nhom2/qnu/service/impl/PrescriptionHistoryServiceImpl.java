package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Medicines;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionDetail;
import com.nhom2.qnu.model.PrescriptionHistory;
import com.nhom2.qnu.payload.request.PrescriptionHistoryRequest;
import com.nhom2.qnu.payload.response.prescriptionhistory.CreatePrescriptionHistoryResponse;
import com.nhom2.qnu.payload.response.prescriptionhistory.UpdatePrescriptionHistoryResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.MedicinesRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.PrescriptionHistoryRepository;
import com.nhom2.qnu.service.PrescriptionHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PrescriptionHistoryServiceImpl
        implements PrescriptionHistoryService {

    @Autowired
    private PatientsRepository patientsRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionHistoryRepository prescriptionHistoryRepository;

    @Autowired
    private MedicinesRepository medicinesRepository;

    // =========================================================
    // CREATE PRESCRIPTION
    // =========================================================
    @Override
    @Transactional
    public ResponseEntity<CreatePrescriptionHistoryResponse> save(
            PrescriptionHistoryRequest req) {

        // 1. Lấy bệnh nhân
        Patients patient = patientsRepository
                .findById(req.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patient not found"));

        // 2. Lấy lịch khám
        AppointmentSchedules appointment = appointmentRepository
                .findById(req.getAppointmentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Appointment not found"));

        // 3. Tạo đơn thuốc
        PrescriptionHistory prescription = PrescriptionHistory.builder()
                .patient(patient)
                .appointment(appointment)
                .note(req.getNote())
                .build();

        // save trước để có id
        prescriptionHistoryRepository.save(prescription);

        // 4. Tạo chi tiết thuốc
        for (PrescriptionHistoryRequest.Detail d : req.getDetails()) {

            Medicines medicine = medicinesRepository.findById(
                    d.getMedicineId())
                    .orElseThrow(() -> new RuntimeException(
                            "Medicine not found"));

            PrescriptionDetail detail = PrescriptionDetail.builder()
                    .prescriptionHistory(
                            prescription)
                    .medicine(medicine)
                    .quantity(d.getQuantity())
                    .dosage(d.getDosage())
                    .duration(d.getDuration())
                    .build();

            prescription.getDetails().add(detail);
        }

        // 5. Save lại
        prescriptionHistoryRepository.save(prescription);

        // 6. Update trạng thái khám
        appointment.setStatus("Đã kê đơn");

        appointmentRepository.save(appointment);

        // 7. Response
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new CreatePrescriptionHistoryResponse(
                                "201",
                                "Created successfully",
                                prescription.getPrescriptionId()));
    }

    // =========================================================
    // UPDATE PRESCRIPTION
    // =========================================================
    @Override
    @Transactional
    public ResponseEntity<UpdatePrescriptionHistoryResponse> update(
            PrescriptionHistoryRequest req,
            String id) {

        // 1. Tìm đơn thuốc
        PrescriptionHistory prescription = prescriptionHistoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Prescription not found"));

        // 2. Xóa toàn bộ detail cũ
        prescription.getDetails().clear();

        // 3. Update note
        prescription.setNote(req.getNote());

        // 4. Add detail mới
        for (PrescriptionHistoryRequest.Detail d : req.getDetails()) {

            Medicines medicine = medicinesRepository.findById(
                    d.getMedicineId())
                    .orElseThrow(() -> new RuntimeException(
                            "Medicine not found"));

            PrescriptionDetail detail = PrescriptionDetail.builder()
                    .prescriptionHistory(
                            prescription)
                    .medicine(medicine)
                    .quantity(d.getQuantity())
                    .dosage(d.getDosage())
                    .duration(d.getDuration())
                    .build();

            prescription.getDetails().add(detail);
        }

        // 5. Save update
        prescriptionHistoryRepository.save(prescription);

        // 6. Response
        return ResponseEntity.ok(
                UpdatePrescriptionHistoryResponse
                        .builder()
                        .status("200")
                        .massage("Updated successfully")
                        .build());
    }
}