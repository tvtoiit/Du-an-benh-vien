package com.nhom2.qnu.payload.response.services;

import java.util.List;
import com.nhom2.qnu.model.Services;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetAllListServiceResponse {
  private String status;
  private String massage;
  private List<Services> data;
}
