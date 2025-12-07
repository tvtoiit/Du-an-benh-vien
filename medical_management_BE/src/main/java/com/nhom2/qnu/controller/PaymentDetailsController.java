package com.nhom2.qnu.controller;

import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.payload.response.PatientPaymentResponse;
import com.nhom2.qnu.payload.response.PaymentDetailsResponse;
import com.nhom2.qnu.payload.response.PaymentSummaryResponse;
import com.nhom2.qnu.service.PaymentDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payment-details")
@Validated
public class PaymentDetailsController {
    @Autowired
    private PaymentDetailsService paymentDetailsService;

    @GetMapping("/waiting")
    public ResponseEntity<List<PaymentSummaryResponse>> getPatientsForPayment() {
        return ResponseEntity.ok(
                paymentDetailsService.getPatientsForPayment());
    }

    @PostMapping
    public ResponseEntity<PaymentDetails> create(
            @Valid @RequestBody PaymentDetailsRequest request) {
        PaymentDetails created = paymentDetailsService.createPaymentDetails(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDetails> update(
            @PathVariable("id") String id,
            @Valid @RequestBody PaymentDetailsRequest request) {
        PaymentDetails updated = paymentDetailsService.updatePaymentDetails(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/summary")
    public ResponseEntity<PaymentSummaryResponse> getSummary(
            @RequestParam String patientId,
            @RequestParam(required = false) String prescriptionId) {
        return ResponseEntity.ok(
                paymentDetailsService.getPaymentSummary(patientId, prescriptionId));
    }
}
