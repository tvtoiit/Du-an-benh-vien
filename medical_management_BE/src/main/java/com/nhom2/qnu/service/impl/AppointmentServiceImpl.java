package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.payload.request.AppointmentSchedulesRequest;
import com.nhom2.qnu.payload.response.AppointmentSchedulesResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.payload.response.PatientResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientsRepository patientsRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<AppointmentSchedulesResponse> getAppointmentSchedulesByPatient(String patientId) {

        Patients patients = patientsRepository.findByPatientId(patientId)
                .orElseThrow(() -> new DataNotFoundException("Patients does not exist"));
        List<AppointmentSchedules> appointmentSchedules = appointmentRepository.findAllByPatients(patients);
        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        for (AppointmentSchedules item : appointmentSchedules) {
            responses.add(setupResponse(item));
        }
        return responses;
    }

    @Override
    public List<AppointmentSchedulesResponse> getAppointmentSchedulesByDoctor(String doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));
        List<AppointmentSchedules> appointmentSchedules = appointmentRepository.findAllByDoctor(doctor);
        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        for (AppointmentSchedules item : appointmentSchedules) {
            responses.add(setupResponse(item));
        }
        return responses;
    }

    @Override
    public List<AppointmentSchedulesResponse> getAllAppointmentSchedules() {
        List<AppointmentSchedules> appointmentSchedules = appointmentRepository.findAll();
        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        for (AppointmentSchedules item : appointmentSchedules) {
            responses.add(setupResponse(item));
        }
        return responses;
    }

    @Override
    public AppointmentSchedulesResponse createAppointmentSchedules(AppointmentSchedulesRequest request) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));
        Patients patients = patientsRepository.findByPatientId(request.getPatientsId())
                .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));

        if (checkAppointmentExists(patients, request.getAppointmentDatetime())) {
            return null;
        }
        AppointmentSchedules appointmentSchedules = new AppointmentSchedules();
        appointmentSchedules.setAppointmentDatetime(request.getAppointmentDatetime());
        appointmentSchedules.setDoctor(doctor);
        appointmentSchedules.setPatients(patients);
        appointmentSchedules.setStatus("waiting for censorship");

        AppointmentSchedules newAppointmentSchedules = appointmentRepository.save(appointmentSchedules);

        return setupResponse(newAppointmentSchedules);
    }

    @Override
    public AppointmentSchedulesResponse updateAppointmentSchedules(AppointmentSchedulesRequest request,
            String appointmentSchedulesId) {

        AppointmentSchedules appointmentSchedules = appointmentRepository.findById(appointmentSchedulesId)
                .orElseThrow(() -> new DataNotFoundException("Appointment Schedules does not exist"));
        if (checkAppointmentExists(appointmentSchedules.getPatients(), request.getAppointmentDatetime())) {
            return null;
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));
        Patients patients = patientsRepository.findByPatientId(request.getPatientsId())
                .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));

        appointmentSchedules.setAppointmentDatetime(request.getAppointmentDatetime());
        appointmentSchedules.setDoctor(doctor);
        appointmentSchedules.setPatients(patients);

        if (checkAppointmentExists(appointmentSchedules.getPatients(), request.getAppointmentDatetime())) {
            return null;
        }

        AppointmentSchedules updateAppointmentSchedules = appointmentRepository.save(appointmentSchedules);

        return setupResponse(updateAppointmentSchedules);
    }

    @Override
    public AppointmentSchedulesResponse updateStatusFailed(String AppointmentSchedulesId) {

        AppointmentSchedules appointmentSchedules = appointmentRepository.findById(AppointmentSchedulesId)
                .orElseThrow(() -> new DataNotFoundException("Appointment Schedules does not exist"));
        appointmentSchedules.setStatus("Failed");
        AppointmentSchedules updateAppointmentSchedules = appointmentRepository.save(appointmentSchedules);

        return setupResponse(updateAppointmentSchedules);
    }

    @Override
    public AppointmentSchedulesResponse updateStatusSuccessful(String AppointmentSchedulesId) {
        AppointmentSchedules appointmentSchedules = appointmentRepository.findById(AppointmentSchedulesId)
                .orElseThrow(() -> new DataNotFoundException("Appointment Schedules does not exist"));
        if (checkAppointmentExists(appointmentSchedules.getDoctor(), appointmentSchedules.getAppointmentDatetime())) {
            return null;
        }
        appointmentSchedules.setStatus("Successful");
        AppointmentSchedules updateAppointmentSchedules = appointmentRepository.save(appointmentSchedules);

        return setupResponse(updateAppointmentSchedules);
    }

    public boolean checkAppointmentExists(Patients patient, LocalDateTime appointmentDatetime) {
        return appointmentRepository.existsByPatientsAndAppointmentDatetime(patient, appointmentDatetime);
    }

    public boolean checkAppointmentExists(Doctor doctor, LocalDateTime appointmentDatetime) {
        return appointmentRepository.existsByDoctorAndAppointmentDatetime(doctor, appointmentDatetime);
    }

    public AppointmentSchedulesResponse setupResponse(AppointmentSchedules item) {

        AppointmentSchedulesResponse appointmentSchedulesResponse = new AppointmentSchedulesResponse();
        appointmentSchedulesResponse.setAppointmentScheduleId(item.getAppointmentScheduleId());

        PatientResponse patientResponse = new PatientResponse();
        patientResponse.setPatientId(item.getPatients().getPatientId());
        patientResponse.setFullName(item.getPatients().getUser().getFullName());
        patientResponse.setDateOfBirth(item.getPatients().getDateOfBirth());
        patientResponse.setContactNumber(item.getPatients().getUser().getPhoneNumber());
        patientResponse.setEmail(item.getPatients().getUser().getEmail());
        patientResponse.setAddress(item.getPatients().getUser().getAddress());
        patientResponse.setOtherInfo(item.getPatients().getOtherInfo());

        appointmentSchedulesResponse.setPatient(patientResponse);

        DoctorResponse doctorResponse = new DoctorResponse();
        doctorResponse.setDoctorId(item.getDoctor().getDoctorId());
        doctorResponse.setDoctorName(item.getDoctor().getUser().getFullName());
        doctorResponse.setSpecialization(item.getDoctor().getSpecialization());
        doctorResponse.setContactNumber(item.getDoctor().getUser().getPhoneNumber());
        doctorResponse.setEmail(item.getDoctor().getUser().getEmail());

        appointmentSchedulesResponse.setDoctor(doctorResponse);
        appointmentSchedulesResponse.setAppointmentDatetime(item.getAppointmentDatetime());
        appointmentSchedulesResponse.setStatus(item.getStatus());

        return appointmentSchedulesResponse;
    }
}
