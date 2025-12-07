package com.nhom2.qnu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.PatientResponse;
import com.nhom2.qnu.payload.response.PatientServiceResponse;
import com.nhom2.qnu.payload.response.PatientWaitingResponse;
import com.nhom2.qnu.service.PatientsService;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientsController {

  @Autowired
  private PatientsService patientsService;

  @GetMapping("/{id}")
  public ResponseEntity<?> getPatient(@PathVariable String id) {
    return ResponseEntity.ok(patientsService.findByPatients(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updatePatient(
      @RequestBody PatientRequest request,
      @PathVariable String id) {

    return new ResponseEntity<>(patientsService.updatePatients(request, id), HttpStatus.CREATED);
  }

  @PostMapping("")
  public ResponseEntity<?> createPatients(@RequestBody PatientRequest request) {
    return new ResponseEntity<>(patientsService.createPatients(request), HttpStatus.CREATED);
  }

  @GetMapping("/get_All")
  public List<PatientResponse> getAllPatients() {
    return patientsService.findAllPatients();
  }

  @GetMapping("/services")
  public ResponseEntity<List<PatientServiceResponse>> getAllPatientsWithServices() {
    return ResponseEntity.ok(patientsService.getAllPatientsWithServices());
  }

  @GetMapping("/not-accepted")
  public ResponseEntity<?> getNotAcceptedPatients() {
    return ResponseEntity.ok(patientsService.getPatientsNotAccepted());
  }

  @GetMapping("/by-user/{userId}")
  public Object getPatientByUserId(@PathVariable String userId) {
    return patientsService.getPatientByUserId(userId);
  }

  @GetMapping("/waiting")
  public List<PatientWaitingResponse> getWaitingPatients() {
    return patientsService.getWaitingPatients();
  }
}
