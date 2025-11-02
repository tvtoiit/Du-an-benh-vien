package com.nhom2.qnu.payload.response.prescriptionhistory;

import com.nhom2.qnu.payload.request.PrescriptionHistoryRequest;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreatePrescriptionHistoryResponse {
  private String status;
  private String massage;
  private PrescriptionHistoryRequest data;
}
