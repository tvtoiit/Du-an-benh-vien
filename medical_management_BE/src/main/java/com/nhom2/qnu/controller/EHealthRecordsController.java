package com.nhom2.qnu.controller;

import com.nhom2.qnu.payload.request.EHealthRecordsRequest;
import com.nhom2.qnu.service.EHealthRecordsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/e-health-records")
public class EHealthRecordsController {

    @Autowired
    private EHealthRecordsService eHealthRecordsService;

    @GetMapping("")
    public ResponseEntity<?> getAllEHealthRecord() {
        return ResponseEntity.ok(eHealthRecordsService.getAllEHealthRecord());
    }
    @GetMapping("/{patientId}")
    public ResponseEntity<?> getEHealthRecordByPatient(@PathVariable(value = "patientId") String patientId) {
        return ResponseEntity.ok(eHealthRecordsService.getEHealthRecordByPatient(patientId));
    }
    @PutMapping("/{eHealthRecordId}")
    public ResponseEntity<?> updateEHealthRecord(@RequestBody EHealthRecordsRequest request,
                                          @PathVariable(value = "eHealthRecordId") String eHealthRecordId) {
        return new ResponseEntity<>(eHealthRecordsService.updateEHealthRecord(request, eHealthRecordId), HttpStatus.CREATED);
    }
}
