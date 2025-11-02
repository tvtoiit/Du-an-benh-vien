package com.nhom2.qnu.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.EHealthRecordsResponse;
import com.nhom2.qnu.payload.response.PatientResponse;

public interface PatientsService {
    PatientResponse findByPatients(String username);
    List<PatientResponse> findAllPatients();
    PatientResponse updatePatients(PatientRequest newPatients, String id);
    EHealthRecordsResponse createPatients(PatientRequest patientRequest);
    ResponseEntity<?> addServiceForPatient(String idPatient, String idSerivces);
}
