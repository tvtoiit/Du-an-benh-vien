package com.nhom2.qnu.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.nhom2.qnu.payload.request.ServiceRequest;
import com.nhom2.qnu.payload.response.services.CreateServicesResponse;
import com.nhom2.qnu.payload.response.services.GetAllListServiceResponse;
import com.nhom2.qnu.payload.response.services.UpdateServiceResponse;

@Service
public interface ServicesService {
  public ResponseEntity<GetAllListServiceResponse> getAll();

  public ResponseEntity<CreateServicesResponse> save(ServiceRequest serviceRequest);

  public ResponseEntity<UpdateServiceResponse> update(ServiceRequest request, String id);
}
