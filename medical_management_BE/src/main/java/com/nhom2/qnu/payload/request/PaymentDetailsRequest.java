package com.nhom2.qnu.payload.request;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PaymentDetailsRequest {
  
    private String patientId;
    private String prescriptionHistoryId;
    private BigDecimal total_amount;
}
