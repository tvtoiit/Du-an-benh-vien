package com.nhom2.qnu.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.nhom2.qnu.payload.request.PrescriptionHistoryRequest;
import com.nhom2.qnu.payload.response.prescriptionhistory.CreatePrescriptionHistoryResponse;
import com.nhom2.qnu.payload.response.prescriptionhistory.UpdatePrescriptionHistoryResponse;

@Service
public interface PrescriptionHistoryService {

  ResponseEntity<CreatePrescriptionHistoryResponse> save(
      PrescriptionHistoryRequest prescriptionHistoryRequest);

  ResponseEntity<UpdatePrescriptionHistoryResponse> update(
      PrescriptionHistoryRequest prescriptionHistoryRequest, String id);
}
