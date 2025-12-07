package com.nhom2.qnu.payload.response.services;

import com.nhom2.qnu.payload.response.ServiceResponse;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetAllListServiceResponse {
  private String status;
  private String massage;
  private List<ServiceResponse> data;
}
