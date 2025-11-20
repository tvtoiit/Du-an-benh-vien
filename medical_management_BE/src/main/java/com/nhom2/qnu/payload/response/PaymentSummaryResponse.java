package com.nhom2.qnu.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentSummaryResponse {
    private String patientId;
    private String fullName;

    private Long examFee;       // tiền khám
    private Long serviceFee;    // tiền dịch vụ CLS
    private Long medicineFee;   // tiền thuốc

    private Long advanceTotal;  // tổng tạm ứng đã thu
    private Long totalCost;     // exam + service + medicine
    private Long amountToPay;   // totalCost - advanceTotal (>= 0)
}

