package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.payload.request.ServiceResultRequest;
import com.nhom2.qnu.model.*;
import com.nhom2.qnu.repository.*;
import com.nhom2.qnu.service.ServiceResultService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ServiceResultServiceImpl implements ServiceResultService {

    private final ServiceResultRepository serviceResultRepository;
    private final PatientsRepository patientRepository;
    private final ServicesRepository servicesRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalHistoriesRepository medicalHistoryRepository;

    public ServiceResultServiceImpl(ServiceResultRepository serviceResultRepository,
            PatientsRepository patientRepository,
            ServicesRepository servicesRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            MedicalHistoriesRepository medicalHistoryRepository) {
        this.serviceResultRepository = serviceResultRepository;
        this.patientRepository = patientRepository;
        this.servicesRepository = servicesRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalHistoryRepository = medicalHistoryRepository;
    }

    @Override
    public ServiceResult saveServiceResult(ServiceResultRequest request) throws IOException {
        ServiceResult result = new ServiceResult();

        // Bệnh nhân
        Patients patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        result.setPatient(patient);

        // Dịch vụ
        Services service = servicesRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        result.setService(service);

        // Bác sĩ (nếu có)
        if (request.getDoctorId() != null && !request.getDoctorId().isEmpty()) {
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            result.setDoctor(doctor);
        }

        // Lịch hẹn (nếu có)
        // if (request.getAppointmentScheduleId() != null &&
        // !request.getAppointmentScheduleId().isEmpty()) {
        // AppointmentSchedules appointment =
        // appointmentRepository.findById(request.getAppointmentScheduleId())
        // .orElseThrow(() -> new RuntimeException("Appointment not found"));
        // result.setAppointmentSchedule(appointment);
        // }

        // Lịch sử khám (nếu có)
        // if (request.getMedicalHistoryId() != null &&
        // !request.getMedicalHistoryId().isEmpty()) {
        // MedicalHistories history =
        // medicalHistoryRepository.findById(request.getMedicalHistoryId())
        // .orElseThrow(() -> new RuntimeException("Medical history not found"));
        // result.setMedicalHistory(history);
        // }

        result.setResultData(request.getResultData());
        result.setStatus(request.getStatus());
        result.setImageUrl(null);

        // File (nếu có)
        MultipartFile file = request.getImageFile();
        if (file != null && !file.isEmpty()) {
            // TODO: Lưu file lên server hoặc cloud storage
            String fileUrl = "/uploads/" + file.getOriginalFilename();
            result.setImageUrl(fileUrl);
        }

        return serviceResultRepository.save(result);
    }
}
