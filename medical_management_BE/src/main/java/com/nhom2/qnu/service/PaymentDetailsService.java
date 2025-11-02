package com.nhom2.qnu.service;

import org.springframework.http.ResponseEntity;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.payload.response.paymentetails.CreatePaymentDetailsResponse;

public interface PaymentDetailsService {

  ResponseEntity<CreatePaymentDetailsResponse> save(PaymentDetailsRequest paymentDetailsRequest);
}
