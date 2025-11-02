package com.nhom2.qnu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.payload.response.paymentetails.CreatePaymentDetailsResponse;
import com.nhom2.qnu.service.PaymentDetailsService;

@RestController
@RequestMapping("/api/v1/payment_details")
public class PaymentDetailsController {
  
  @Autowired
  private PaymentDetailsService paymentDetailsService;
  
  @PostMapping("/create")
  public ResponseEntity<CreatePaymentDetailsResponse> save(@RequestBody PaymentDetailsRequest paymentDetailsRequest){
    return paymentDetailsService.save(paymentDetailsRequest);
  }
  
}
