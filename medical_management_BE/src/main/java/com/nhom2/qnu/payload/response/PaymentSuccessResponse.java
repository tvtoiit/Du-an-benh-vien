package com.nhom2.qnu.payload.response;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class PaymentSuccessResponse {
    private String paymentDetailId;
    private BigDecimal totalAmount;
    private String status;
}
