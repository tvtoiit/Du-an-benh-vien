package com.nhom2.qnu.payload.response.paymentetails;

import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreatePaymentDetailsResponse {
  private String status;
  private String massage;
  private PaymentDetailsRequest data;
}
