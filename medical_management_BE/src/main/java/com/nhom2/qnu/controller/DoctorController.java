package com.nhom2.qnu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.service.DoctorService;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // ==========================================
    // CREATE DOCTOR
    // ==========================================
    @PostMapping("/create")
    public ResponseEntity<?> createDoctors(
            @RequestBody DoctorRequest request) {

        return new ResponseEntity<>(
                doctorService.createDoctors(request),
                HttpStatus.CREATED);
    }

    // ==========================================
    // UPDATE DOCTOR
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(
            @RequestBody DoctorRequest request,
            @PathVariable("id") String id) {

        return new ResponseEntity<>(
                doctorService.updateDoctors(id, request),
                HttpStatus.OK);
    }

    // ==========================================
    // GET ONE DOCTOR
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctor(
            @PathVariable("id") String id) {

        return ResponseEntity.ok(
                doctorService.findDoctorServiceImpl(id));
    }

    // ==========================================
    // GET ALL DOCTORS
    // ==========================================
    @GetMapping("/get_All")
    public List<DoctorResponse> getAllDoctors() {

        return doctorService.findAllDoctors();
    }
}