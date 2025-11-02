package com.nhom2.qnu.controller;

import com.nhom2.qnu.payload.request.AppointmentSchedulesRequest;
import com.nhom2.qnu.payload.request.MedicalHistoriesRequest;
import com.nhom2.qnu.payload.response.AppointmentSchedulesResponse;
import com.nhom2.qnu.payload.response.MedicalHistoriesResponse;
import com.nhom2.qnu.service.MedicalHistoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/medical-histories")
public class MedicalHistoriesController {

    @Autowired
    private MedicalHistoriesService medicalHistoriesService;

    @PostMapping("")
    public ResponseEntity<?> createMedicalHistories(@RequestBody MedicalHistoriesRequest request) {
        return new ResponseEntity<>(medicalHistoriesService.createMedicalHistories(request), HttpStatus.CREATED);
    }

    @PutMapping("/{medicalHistoryId}")
    public ResponseEntity<?> updateMedicalHistories(@RequestBody MedicalHistoriesRequest request,
                                                    @PathVariable(value = "medicalHistoryId") String medicalHistoryId) {
        return new ResponseEntity<>(medicalHistoriesService.updateMedicalHistories(request, medicalHistoryId), HttpStatus.CREATED);
    }
}
