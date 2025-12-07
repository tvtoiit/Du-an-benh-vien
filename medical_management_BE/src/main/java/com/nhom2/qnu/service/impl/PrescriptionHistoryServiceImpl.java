package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.*;
import com.nhom2.qnu.payload.request.PrescriptionHistoryRequest;
import com.nhom2.qnu.payload.response.prescriptionhistory.CreatePrescriptionHistoryResponse;
import com.nhom2.qnu.payload.response.prescriptionhistory.UpdatePrescriptionHistoryResponse;
import com.nhom2.qnu.repository.*;
import com.nhom2.qnu.service.PrescriptionHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PrescriptionHistoryServiceImpl implements PrescriptionHistoryService {

  @Autowired
  private PatientsRepository patientsRepository;

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private PrescriptionHistoryRepository prescriptionHistoryRepository;

  @Autowired
  private MedicinesRepository medicinesRepository;

  @Override
  @Transactional
  public ResponseEntity<CreatePrescriptionHistoryResponse> save(PrescriptionHistoryRequest req) {

    // 1. Lấy bệnh nhân
    Patients patient = patientsRepository.findById(req.getPatientId())
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Patient not found"));

    // 2. Lấy lần khám
    AppointmentSchedules appointment = appointmentRepository.findById(req.getAppointmentId())
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Appointment not found"));

    // 3. Tạo đơn thuốc (header)
    PrescriptionHistory prescription = PrescriptionHistory.builder()
        .patient(patient)
        .appointment(appointment)
        .note(req.getNote())
        .build();

    // lưu header trước
    prescriptionHistoryRepository.save(prescription);

    // 4. Lưu từng thuốc
    for (PrescriptionHistoryRequest.Detail d : req.getDetails()) {

      Medicines med = medicinesRepository.findById(d.getMedicineId())
          .orElseThrow(() -> new RuntimeException("Medicine not found"));

      // Kiểm tra tồn kho
      if (med.getQuantity() < d.getQuantity()) {
        throw new RuntimeException("Not enough stock for: " + med.getName());
      }

      // Trừ kho
      med.setQuantity(med.getQuantity() - d.getQuantity());
      medicinesRepository.save(med);

      // Tạo detail
      PrescriptionDetail detail = PrescriptionDetail.builder()
          .prescriptionHistory(prescription)
          .medicine(med)
          .quantity(d.getQuantity())
          .dosage(d.getDosage())
          .duration(d.getDuration())
          .build();

      prescription.getDetails().add(detail);
    }

    // 5. Save lại đơn có detail (cascade)
    prescriptionHistoryRepository.save(prescription);

    // 6. Cập nhật trạng thái lần khám
    appointment.setStatus("Đã kê đơn");
    appointmentRepository.save(appointment);

    // 7. Trả về response
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(new CreatePrescriptionHistoryResponse(
            "201",
            "Created successfully",
            prescription.getPrescriptionId()));
  }

  @Override
  @Transactional
  public ResponseEntity<UpdatePrescriptionHistoryResponse> update(
      PrescriptionHistoryRequest req, String id) {

    // 1) Lấy đơn thuốc
    PrescriptionHistory prescription = prescriptionHistoryRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Prescription not found"));

    // 2) Xóa toàn bộ chi tiết cũ (vì đơn thuốc thay đổi)
    prescription.getDetails().clear();

    // 3) Cập nhật ghi chú
    prescription.setNote(req.getNote());

    // 4) Lưu lại detail mới
    for (PrescriptionHistoryRequest.Detail d : req.getDetails()) {

      Medicines med = medicinesRepository.findById(d.getMedicineId())
          .orElseThrow(() -> new RuntimeException("Medicine not found"));

      // Không trừ kho khi update (tùy nhu cầu — nếu cần tôi viết thêm)
      PrescriptionDetail detail = PrescriptionDetail.builder()
          .prescriptionHistory(prescription)
          .medicine(med)
          .quantity(d.getQuantity())
          .dosage(d.getDosage())
          .duration(d.getDuration())
          .build();

      prescription.getDetails().add(detail);
    }

    prescriptionHistoryRepository.save(prescription);

    return ResponseEntity.ok(
        UpdatePrescriptionHistoryResponse.builder()
            .status("200")
            .massage("Updated successfully")
            .build());
  }

}
