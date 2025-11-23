package com.nhom2.qnu.controller;

import com.nhom2.qnu.model.AdvancePayment;
import com.nhom2.qnu.payload.request.AdvancePaymentRequest;
import com.nhom2.qnu.service.AdvancePaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/advance-payments")
@Validated
public class AdvancePaymentController {
    @Autowired
    private AdvancePaymentService advancePaymentService;

    public AdvancePaymentController(AdvancePaymentService advancePaymentService) {
        this.advancePaymentService = advancePaymentService;
    }

    // Create new advance payment
    @PostMapping
    public ResponseEntity<AdvancePayment> create(@Valid @RequestBody AdvancePaymentRequest request) {
        AdvancePayment created = advancePaymentService.createAdvancePayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Update existing advance payment (PUT replaces resource; DTO currently
    // requires patientId & amount)
    @PutMapping("/{id}")
    public ResponseEntity<AdvancePayment> update(
            @PathVariable("id") String advanceId,
            @Valid @RequestBody AdvancePaymentRequest request) {
        AdvancePayment updated = advancePaymentService.updateAdvancePayment(advanceId, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/patients")
    public ResponseEntity<?> getPatients() {
        return ResponseEntity.ok(advancePaymentService.getPatientsForAdvance());
    }
}
