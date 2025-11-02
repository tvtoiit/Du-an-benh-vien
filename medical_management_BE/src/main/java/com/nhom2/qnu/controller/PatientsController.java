package com.nhom2.qnu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.PatientResponse;
import com.nhom2.qnu.service.PatientsService;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientsController {

  @Autowired
  private PatientsService patientsService;

  @GetMapping("/{id}")
  public ResponseEntity<?> getPatient(@PathVariable(value = "id") String id) {
    return ResponseEntity.ok(patientsService.findByPatients(id));
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updatePatient(@RequestBody PatientRequest request,
      @PathVariable(value = "id") String id) {
    return new ResponseEntity<>(patientsService.updatePatients(request, id), HttpStatus.CREATED);
  }

  @PostMapping("")
  public ResponseEntity<?> createPatients(@RequestBody PatientRequest request) {
    return new ResponseEntity<>(patientsService.createPatients(request), HttpStatus.CREATED);
  }

  @PostMapping("/add_service")
  public ResponseEntity<?> addServiceForPatient(@RequestParam String idPatient, String idSerivces) {
    return patientsService.addServiceForPatient(idPatient, idSerivces);
  }

  @GetMapping("/get_All")
  public List<PatientResponse> getAllPatients() {
    return patientsService.findAllPatients();
  }
}
