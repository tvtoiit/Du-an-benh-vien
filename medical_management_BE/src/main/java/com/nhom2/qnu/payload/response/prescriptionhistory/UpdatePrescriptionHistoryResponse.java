package com.nhom2.qnu.payload.response.prescriptionhistory;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdatePrescriptionHistoryResponse {
  private String status;
  private String massage;
}
