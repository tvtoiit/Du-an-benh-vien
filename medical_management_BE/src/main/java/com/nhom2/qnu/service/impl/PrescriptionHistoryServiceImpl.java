package com.nhom2.qnu.service.impl;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionHistory;
import com.nhom2.qnu.payload.request.PrescriptionHistoryRequest;
import com.nhom2.qnu.payload.response.prescriptionhistory.CreatePrescriptionHistoryResponse;
import com.nhom2.qnu.payload.response.prescriptionhistory.UpdatePrescriptionHistoryResponse;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.PrescriptionHistoryRepository;
import com.nhom2.qnu.service.PrescriptionHistoryService;

@Service
public class PrescriptionHistoryServiceImpl implements PrescriptionHistoryService {
  @Autowired
  private PatientsRepository patientsRepository;
  
  @Autowired
  private PrescriptionHistoryRepository prescriptionHistoryRepository;

  @Override
  public ResponseEntity<CreatePrescriptionHistoryResponse> save(
      PrescriptionHistoryRequest prescriptionHistoryRequest) {
    Optional<Patients> patients = patientsRepository.findById(prescriptionHistoryRequest.getPatientId());
    if(patients.isPresent()) {
      PrescriptionHistory prescriptionHistory = PrescriptionHistory.builder()
          .patient(patients.get())
          .dosage(prescriptionHistoryRequest.getDosage())
          .duration(prescriptionHistoryRequest.getDuration())
          .medicineId(prescriptionHistoryRequest.getMedicineId())
          .build();
      prescriptionHistoryRepository.save(prescriptionHistory);
      CreatePrescriptionHistoryResponse response = CreatePrescriptionHistoryResponse.builder()
          .status("201")
          .massage("create successfully")
          .data(prescriptionHistoryRequest)
          .build();
      return new ResponseEntity<CreatePrescriptionHistoryResponse>(response, HttpStatus.CREATED);
    }
    return new ResponseEntity<CreatePrescriptionHistoryResponse>(HttpStatus.NOT_FOUND);
  }

  @Override
  public ResponseEntity<UpdatePrescriptionHistoryResponse> update(
      PrescriptionHistoryRequest prescriptionHistoryRequest, String id) {
    Optional<PrescriptionHistory> prescriptionHistory = prescriptionHistoryRepository.findById(id);
    Optional<Patients> patients = patientsRepository.findById(prescriptionHistoryRequest.getPatientId());
    if(prescriptionHistory.isPresent() && patients.isPresent()) {
         prescriptionHistory.get().setPatient(patients.get());
         prescriptionHistory.get().setDosage(prescriptionHistoryRequest.getDosage());
         prescriptionHistory.get().setDuration(prescriptionHistoryRequest.getDuration());;
         prescriptionHistory.get().setMedicineId(prescriptionHistoryRequest.getMedicineId());
         
          prescriptionHistoryRepository.save(prescriptionHistory.get());
          UpdatePrescriptionHistoryResponse response = UpdatePrescriptionHistoryResponse.builder()
              .status("200")
              .massage("update successfully")
              .build();
          return new ResponseEntity<UpdatePrescriptionHistoryResponse>(response, HttpStatus.OK);
        }
        return new ResponseEntity<UpdatePrescriptionHistoryResponse>(HttpStatus.NOT_FOUND);
  }
}
