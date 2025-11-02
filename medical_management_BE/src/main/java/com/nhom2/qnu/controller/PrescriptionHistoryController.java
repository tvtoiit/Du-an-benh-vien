package com.nhom2.qnu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nhom2.qnu.payload.request.PrescriptionHistoryRequest;
import com.nhom2.qnu.payload.response.prescriptionhistory.CreatePrescriptionHistoryResponse;
import com.nhom2.qnu.payload.response.prescriptionhistory.UpdatePrescriptionHistoryResponse;
import com.nhom2.qnu.service.PrescriptionHistoryService;

@RestController
@RequestMapping("/api/v1/prescription_history")
public class PrescriptionHistoryController {
  @Autowired
  private PrescriptionHistoryService prescriptionHistoryService;

  @PostMapping("/create")
  public ResponseEntity<CreatePrescriptionHistoryResponse> save(
      @RequestBody PrescriptionHistoryRequest prescriptionHistoryRequest) {
    return prescriptionHistoryService.save(prescriptionHistoryRequest);
  }

  @PutMapping("/{id}")
  public ResponseEntity<UpdatePrescriptionHistoryResponse> update(
      @RequestBody PrescriptionHistoryRequest prescriptionHistoryRequest,
      @PathVariable(value = "id") String id) {
    return prescriptionHistoryService.update(prescriptionHistoryRequest, id);
  }
}
