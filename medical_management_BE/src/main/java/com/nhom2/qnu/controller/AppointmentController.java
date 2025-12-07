package com.nhom2.qnu.controller;

import com.nhom2.qnu.payload.request.AppointmentRequest;
import com.nhom2.qnu.payload.request.ServiceAssignRequest;
import com.nhom2.qnu.service.AppointmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

    @PostMapping("/patients/{patientId}/services")
    public ResponseEntity<?> assignServices(
            @PathVariable String patientId,
            @RequestBody ServiceAssignRequest req) {

        appointmentService.assignServices(patientId, req.getServiceIds());
        return ResponseEntity.ok("Thành công");
    }

}
