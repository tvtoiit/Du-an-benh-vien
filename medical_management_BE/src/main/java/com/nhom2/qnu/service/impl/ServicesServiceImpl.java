package com.nhom2.qnu.service.impl;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.nhom2.qnu.model.Services;
import com.nhom2.qnu.payload.request.ServiceRequest;
import com.nhom2.qnu.payload.response.services.CreateServicesResponse;
import com.nhom2.qnu.payload.response.services.GetAllListServiceResponse;
import com.nhom2.qnu.payload.response.services.UpdateServiceResponse;
import com.nhom2.qnu.repository.ServicesRepository;
import com.nhom2.qnu.service.ServicesService;

@Service
public class ServicesServiceImpl implements ServicesService {
  @Autowired
  ServicesRepository servicesRepository;

  @Override
  public ResponseEntity<GetAllListServiceResponse> getAll() {
    List<Services> list = servicesRepository.findAll();
    if (list.isEmpty()) {
      return new ResponseEntity<GetAllListServiceResponse>(HttpStatus.NO_CONTENT);
    }
    GetAllListServiceResponse response = GetAllListServiceResponse.builder().status("200")
        .massage("successfully retrieved data").data(list).build();
    return new ResponseEntity<GetAllListServiceResponse>(response, HttpStatus.OK);
  }

  @Override
  public ResponseEntity<CreateServicesResponse> save(ServiceRequest serviceRequest) {
    Services services = Services.builder().serviceName(serviceRequest.getServiceName())
        .description(serviceRequest.getDescription()).price(serviceRequest.getPrice()).build();
    servicesRepository.save(services);
    CreateServicesResponse response = CreateServicesResponse.builder().status("201")
        .massage("create successfully").data(serviceRequest).build();
    return new ResponseEntity<CreateServicesResponse>(response, HttpStatus.CREATED);
  }

  @Override
  public ResponseEntity<UpdateServiceResponse> update(ServiceRequest request, String id) {
    Optional<Services> services = servicesRepository.findById(id);
    if (services.isPresent()) {
      services.get().setServiceName(request.getServiceName());
      services.get().setPrice(request.getPrice());
      services.get().setDescription(request.getDescription());
      servicesRepository.save(services.get());

      UpdateServiceResponse response =
          UpdateServiceResponse.builder().massage("update successfully").status("200").build();
      return new ResponseEntity<UpdateServiceResponse>(response, HttpStatus.OK);
    }
    return new ResponseEntity<UpdateServiceResponse>(HttpStatus.NOT_FOUND);
  }
}
