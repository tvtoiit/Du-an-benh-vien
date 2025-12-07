package com.nhom2.qnu.payload.response.prescriptionhistory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePrescriptionHistoryResponse {

  private String status;
  private String message;
  private String prescriptionId;
}
