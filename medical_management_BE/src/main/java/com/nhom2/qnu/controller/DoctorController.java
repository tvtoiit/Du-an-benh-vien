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
import org.springframework.web.bind.annotation.RestController;

import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.service.DoctorService;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {
    @Autowired
    private DoctorService doctorService;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@RequestBody DoctorRequest request,
            @PathVariable(value = "id") String id) {
        return new ResponseEntity<>(doctorService.updateDoctors(request, id), HttpStatus.CREATED);
    }

    @PostMapping("")
    public ResponseEntity<?> createDoctor(@RequestBody DoctorRequest request) {
      return new ResponseEntity<>(doctorService.createDoctors(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatient(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok(doctorService.finđDoctorServiceImpl(id));
    }

    @GetMapping("/get_All")
    public List<DoctorResponse> getAllPatients() {
        return doctorService.findAllDoctors();
    }
}
