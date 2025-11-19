package com.nhom2.qnu.controller;

import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.service.PaymentDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/payment-details")
@Validated
public class PaymentDetailsController {

    private final PaymentDetailsService paymentDetailsService;

    public PaymentDetailsController(PaymentDetailsService paymentDetailsService) {
        this.paymentDetailsService = paymentDetailsService;
    }

    @PostMapping
    public ResponseEntity<PaymentDetails> create(@Valid @RequestBody PaymentDetailsRequest request) {
        PaymentDetails created = paymentDetailsService.createPaymentDetails(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDetails> update(@PathVariable("id") String id,
                                                 @Valid @RequestBody PaymentDetailsRequest request) {
        PaymentDetails updated = paymentDetailsService.updatePaymentDetails(id, request);
        return ResponseEntity.ok(updated);
    }
}
