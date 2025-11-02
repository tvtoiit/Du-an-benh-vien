package com.nhom2.qnu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nhom2.qnu.payload.request.ServiceRequest;
import com.nhom2.qnu.payload.response.services.CreateServicesResponse;
import com.nhom2.qnu.payload.response.services.GetAllListServiceResponse;
import com.nhom2.qnu.payload.response.services.UpdateServiceResponse;
import com.nhom2.qnu.service.ServicesService;

@RestController
@RequestMapping("/api/v1/services")
public class ServicesController {
  @Autowired
  ServicesService servicesService;

  @GetMapping("/get_all")
  public ResponseEntity<GetAllListServiceResponse> getAll() {
    return servicesService.getAll();
  }
  
  @PostMapping("/create")
  public ResponseEntity<CreateServicesResponse> save(@RequestBody ServiceRequest serviceRequest){
    return servicesService.save(serviceRequest);
  }
  @PutMapping("/{id}")
  public ResponseEntity<UpdateServiceResponse> updateDoctor(@RequestBody ServiceRequest request,
          @PathVariable(value = "id") String id) {
      return servicesService.update(request, id);
  }
}
