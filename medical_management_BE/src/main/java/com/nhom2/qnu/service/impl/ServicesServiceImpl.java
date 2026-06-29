package com.nhom2.qnu.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.nhom2.qnu.enums.ServiceType;
import com.nhom2.qnu.exception.DataExistException;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.RoomGroup;
import com.nhom2.qnu.model.Services;
import com.nhom2.qnu.payload.request.ServiceRequest;
import com.nhom2.qnu.payload.response.services.CreateServicesResponse;
import com.nhom2.qnu.payload.response.services.GetAllListServiceResponse;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.ServiceResponse;

import com.nhom2.qnu.payload.response.services.UpdateServiceResponse;
import com.nhom2.qnu.repository.ServicesRepository;
import com.nhom2.qnu.repository.AppointmentServiceRepository;
import com.nhom2.qnu.service.ServicesService;
import com.nhom2.qnu.repository.RoomGroupRepository;

@Service
public class ServicesServiceImpl implements ServicesService {
    @Autowired
    ServicesRepository servicesRepository;

    @Autowired
    AppointmentServiceRepository appointmentServiceRepository;

    @Autowired
    private RoomGroupRepository roomGroupRepository;

    @Override
    public ResponseEntity<GetAllListServiceResponse> getAll() {

        List<Services> list = servicesRepository.findAll();

        if (list.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<ServiceResponse> dtoList = list.stream()
                .map((Services s) -> ServiceResponse.builder()
                        .serviceId(s.getServiceId())
                        .serviceName(s.getServiceName())
                        .description(s.getDescription())
                        .price(s.getPrice())
                        .serviceType(s.getServiceType())
                        .roomGroupId(
                                s.getRoomGroup() != null
                                        ? s.getRoomGroup().getRoomGroupId()
                                        : null)

                        .roomGroupName(
                                s.getRoomGroup() != null
                                        ? s.getRoomGroup().getGroupName()
                                        : null)
                        .build())
                .collect(Collectors.toList());

        GetAllListServiceResponse response = GetAllListServiceResponse.builder()
                .status("200")
                .massage("successfully retrieved data")
                .data(dtoList)
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<GetAllListServiceResponse> getClinicalServices() {

        List<Services> list = servicesRepository.findByServiceType(ServiceType.CLINICAL);

        if (list.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<ServiceResponse> dtoList = list.stream()
                .map(s -> ServiceResponse.builder()
                        .serviceId(s.getServiceId())
                        .serviceName(s.getServiceName())
                        .description(s.getDescription())
                        .price(s.getPrice())
                        .serviceType(s.getServiceType())
                        .roomGroupId(
                                s.getRoomGroup() != null
                                        ? s.getRoomGroup().getRoomGroupId()
                                        : null)
                        .roomGroupName(
                                s.getRoomGroup() != null
                                        ? s.getRoomGroup().getGroupName()
                                        : null)
                        .build())
                .collect(Collectors.toList());

        GetAllListServiceResponse response = GetAllListServiceResponse.builder()
                .status("200")
                .massage("Successfully retrieved clinical services")
                .data(dtoList)
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<CreateServicesResponse> save(ServiceRequest req) {

        if (req.getServiceName() == null || req.getServiceName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên dịch vụ không được để trống");
        }

        if (req.getPrice() == null || req.getPrice().signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giá dịch vụ không hợp lệ");
        }

        if (req.getServiceType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bắt buộc phải chọn loại dịch vụ");
        }

        if (servicesRepository.existsByServiceNameIgnoreCase(req.getServiceName())) {
            throw new DataExistException("Dịch vụ đã tồn tại");
        }

        RoomGroup roomGroup = roomGroupRepository.findById(
                req.getRoomGroupId())
                .orElseThrow(() -> new DataNotFoundException(
                        "Không tìm thấy khoa"));

        Services services = Services.builder()
                .serviceName(req.getServiceName())
                .description(req.getDescription())
                .price(req.getPrice())
                .serviceType(req.getServiceType())
                .roomGroup(roomGroup)
                .build();

        servicesRepository.save(services);

        CreateServicesResponse response = CreateServicesResponse.builder()
                .status("201")
                .massage("create successfully")
                .data(req)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<UpdateServiceResponse> update(ServiceRequest request, String id) {

        Services service = servicesRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException(
                        "Không tìm thấy dịch vụ với id: " + id));

        // ===== VALIDATE =====
        if (request.getServiceName() == null || request.getServiceName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tên dịch vụ không được để trống");
        }

        if (request.getPrice() == null || request.getPrice().signum() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giá dịch vụ không hợp lệ");
        }

        if (request.getRoomGroupId() != null) {

            RoomGroup roomGroup = roomGroupRepository.findById(
                    request.getRoomGroupId())
                    .orElseThrow(() -> new DataNotFoundException(
                            "Không tìm thấy khoa"));

            service.setRoomGroup(roomGroup);
        }

        // ===== CHECK TRÙNG TÊN (QUAN TRỌNG) =====
        boolean isDuplicate = servicesRepository
                .existsByServiceNameIgnoreCaseAndServiceIdNot(
                        request.getServiceName(),
                        id);

        if (isDuplicate) {
            throw new DataExistException("Tên dịch vụ đã tồn tại");
        }

        // ===== UPDATE =====
        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());

        servicesRepository.save(service);

        UpdateServiceResponse response = UpdateServiceResponse.builder()
                .status("200")
                .massage("update successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    public void delete(String id) {

        Services service = servicesRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Dịch vụ không tồn tại!"));

        boolean inUse = appointmentServiceRepository.existsByService_ServiceId(id);
        if (inUse) {
            throw new DataExistException("Dịch vụ đang được sử dụng trong lịch khám, không thể xóa!");
        }

        servicesRepository.delete(service);
    }

    @Override
    public ResponseEntity<?> getDoctorServices(
            String roomGroupId) {

        List<Services> services = servicesRepository
                .findByRoomGroup_RoomGroupIdAndServiceType(
                        roomGroupId,
                        ServiceType.DOCTOR);

        List<ServiceResponse> result = services.stream()
                .map(service -> ServiceResponse.builder()
                        .serviceId(
                                service.getServiceId())
                        .serviceName(
                                service.getServiceName())
                        .description(
                                service.getDescription())
                        .price(
                                service.getPrice())
                        .serviceType(
                                service.getServiceType())
                        .roomGroupId(
                                service.getRoomGroup()
                                        .getRoomGroupId())
                        .roomGroupName(
                                service.getRoomGroup()
                                        .getGroupName())
                        .build())
                .toList();

        return ResponseEntity.ok(result);
    }

}
