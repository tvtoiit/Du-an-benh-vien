package com.nhom2.qnu.controller;

import com.nhom2.qnu.payload.request.AppointmentSchedulesRequest;
import com.nhom2.qnu.payload.response.AppointmentSchedulesResponse;
import com.nhom2.qnu.service.AppointmentService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/appointment-schedules")
public class AppointmentSchedulesController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("")
    public ResponseEntity<?> getAllAppointmentSchedules() {
        return ResponseEntity.ok(appointmentService.getAllAppointmentSchedules());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getAppointmentSchedulesByPatient(@PathVariable(value = "patientId") String patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentSchedulesByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getAppointmentSchedulesByDoctor(@PathVariable(value = "doctorId") String doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentSchedulesByDoctor(doctorId));
    }

    @PostMapping("")
    public ResponseEntity<?> createAppointmentSchedules(
            @RequestBody AppointmentSchedulesRequest request) {

        AppointmentSchedulesResponse response = appointmentService.createAppointmentSchedules(request);

        if (response == null) {
            Map<String, Object> body = new HashMap<>();
            body.put("message", "During this time you have another appointment");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Created successfully");
        body.put("data", response);

        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{appointmentSchedulesId}")
    public ResponseEntity<?> updateAppointmentSchedules(@RequestBody AppointmentSchedulesRequest request,
            @PathVariable(value = "appointmentSchedulesId") String appointmentSchedulesId) {
        AppointmentSchedulesResponse response = appointmentService.updateAppointmentSchedules(request,
                appointmentSchedulesId);
        if (response == null) {
            return new ResponseEntity<>("During this time you have another appointment", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/status-successful/{appointmentSchedulesId}")
    public ResponseEntity<?> updateStatusSuccessful(
            @PathVariable(value = "appointmentSchedulesId") String appointmentSchedulesId) {
        AppointmentSchedulesResponse response = appointmentService.updateStatusSuccessful(appointmentSchedulesId);
        if (response == null) {
            return new ResponseEntity<>("During this time Doctor have another appointment", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/status-failed/{appointmentSchedulesId}")
    public ResponseEntity<?> updateStatusFailed(
            @PathVariable(value = "appointmentSchedulesId") String appointmentSchedulesId) {
        return new ResponseEntity<>(appointmentService.updateStatusFailed(appointmentSchedulesId), HttpStatus.CREATED);
    }
}
