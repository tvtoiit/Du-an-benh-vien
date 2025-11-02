package com.nhom2.qnu.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddServiceForPatientResponse {
  private String status;
  private String massage;
}
