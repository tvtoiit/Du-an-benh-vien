package com.nhom2.qnu.service;

import java.util.List;

import com.nhom2.qnu.dto.PatientAdvanceDTO;
import com.nhom2.qnu.model.AdvancePayment;
import com.nhom2.qnu.payload.request.AdvancePaymentRequest;

public interface AdvancePaymentService {
    AdvancePayment createAdvancePayment(AdvancePaymentRequest req);

    AdvancePayment updateAdvancePayment(String advanceId, AdvancePaymentRequest req);

    List<PatientAdvanceDTO> getPatientsForAdvance();
}