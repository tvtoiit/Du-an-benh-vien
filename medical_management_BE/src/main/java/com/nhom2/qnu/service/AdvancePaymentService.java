package com.nhom2.qnu.service;


import com.nhom2.qnu.model.AdvancePayment;
import com.nhom2.qnu.payload.request.AdvancePaymentRequest;

public interface AdvancePaymentService {
    AdvancePayment createAdvancePayment(AdvancePaymentRequest req);
    AdvancePayment updateAdvancePayment(String advanceId, AdvancePaymentRequest req);
}