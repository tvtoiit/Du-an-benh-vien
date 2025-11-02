package com.nhom2.qnu.payload.response;

import java.math.BigDecimal;

import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PrescriptionHistory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PaymentDetailsResponse {
    
    private String paymentDetailId;
    private Patients patient;
    private PrescriptionHistory prescriptionHistory;
    private BigDecimal total_amount;
}
