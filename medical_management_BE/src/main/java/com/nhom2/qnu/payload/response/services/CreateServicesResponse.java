package com.nhom2.qnu.payload.response.services;

import com.nhom2.qnu.payload.request.ServiceRequest;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateServicesResponse {
  private String status;
  private String massage;
  private ServiceRequest data;
}
