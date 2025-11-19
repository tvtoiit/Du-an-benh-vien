package com.nhom2.qnu.controller;

import com.nhom2.qnu.payload.request.ServiceResultRequest;
import com.nhom2.qnu.model.ServiceResult;
import com.nhom2.qnu.service.ServiceResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/service-results")
public class ServiceResultController {

    private final ServiceResultService serviceResultService;

    public ServiceResultController(ServiceResultService serviceResultService) {
        this.serviceResultService = serviceResultService;
    }

    /**
     * API tạo kết quả dịch vụ cho bệnh nhân
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createServiceResult(
            @RequestParam("patientId") String patientId,
            @RequestParam("serviceId") String serviceId,
            @RequestParam(value = "doctorId", required = false) String doctorId,
            @RequestParam("resultData") String resultData,
            @RequestParam(value = "note", required = false) String note,
            @RequestParam("status") String status,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws Exception {

        ServiceResultRequest request = new ServiceResultRequest();
        request.setPatientId(patientId);
        request.setServiceId(serviceId);
        request.setDoctorId(doctorId);
        // request.setAppointmentScheduleId(appointmentScheduleId);
        // request.setMedicalHistoryId(medicalHistoryId);
        request.setResultData(resultData);
        request.setNote(note);
        request.setStatus(status);
        request.setImageFile(imageFile);

        ServiceResult saved = serviceResultService.saveServiceResult(request);

        return ResponseEntity.ok(saved);
    }
}
