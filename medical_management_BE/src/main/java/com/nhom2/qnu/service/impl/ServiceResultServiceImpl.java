package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.payload.request.ServiceResultRequest;
import com.nhom2.qnu.model.*;
import com.nhom2.qnu.payload.response.PatientWithResultResponse;
import com.nhom2.qnu.payload.response.ServiceResultResponse;
import com.nhom2.qnu.repository.*;
import com.nhom2.qnu.service.ServiceResultService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.HashSet;

import java.time.LocalDate;

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
                // if (request.getDoctorId() != null && !request.getDoctorId().isEmpty()) {
                // Doctor doctor = doctorRepository.findById(request.getDoctorId())
                // .orElseThrow(() -> new RuntimeException("Doctor not found"));
                // result.setDoctor(doctor);
                // }

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

        @Override
        public List<PatientWithResultResponse> getPatientsWithCompletedResults() {

                // 1) Bệnh nhân có kết quả CLS
                List<Patients> completedList = serviceResultRepository.findDistinctPatientsByStatus("Hoàn thành");

                // 2) Bệnh nhân đã tiếp nhận
                List<Patients> acceptedList = appointmentRepository.findAllByStatus("Chờ khám")
                                .stream()
                                .map(AppointmentSchedules::getPatients)
                                .toList();

                // 3) Bệnh nhân đã được bác sĩ kết luận
                List<Patients> concludedList = medicalHistoryRepository.findPatientsWithConclusion();

                // Convert to ID sets
                Set<String> completedIds = completedList.stream()
                                .map(Patients::getPatientId)
                                .collect(Collectors.toSet());

                Set<String> acceptedIds = acceptedList.stream()
                                .map(Patients::getPatientId)
                                .collect(Collectors.toSet());

                Set<String> concludedIds = concludedList.stream()
                                .map(Patients::getPatientId)
                                .collect(Collectors.toSet());

                // Merge unique list
                Map<String, Patients> merged = new HashMap<>();
                completedList.forEach(p -> merged.put(p.getPatientId(), p));
                acceptedList.forEach(p -> merged.put(p.getPatientId(), p));
                concludedList.forEach(p -> merged.put(p.getPatientId(), p));

                // Build final response
                return merged.values().stream()
                                .map(p -> {

                                        String type;

                                        if (concludedIds.contains(p.getPatientId())) {
                                                type = "Đã kết luận";
                                        } else if (completedIds.contains(p.getPatientId())) {
                                                type = "Kết quả CLS";
                                        } else {
                                                type = "Đã tiếp nhận";
                                        }

                                        return PatientWithResultResponse.builder()
                                                        .patientId(p.getPatientId())
                                                        .fullName(p.getUser().getFullName())
                                                        .dateOfBirth(p.getDateOfBirth())
                                                        .contactNumber(p.getUser().getPhoneNumber())
                                                        .status(type)
                                                        .build();
                                })
                                .toList();
        }

        // 2) Danh sách kết quả CLS theo bệnh nhân
        public List<ServiceResultResponse> getCompletedResultsByPatient(String patientId) {
                List<ServiceResult> list = serviceResultRepository.findByPatient_PatientIdAndStatus(patientId,
                                "Hoàn thành");

                return list.stream()
                                .map(sr -> ServiceResultResponse.builder()
                                                .resultId(sr.getResultId())
                                                .serviceName(sr.getService().getServiceName())
                                                .resultData(sr.getResultData())
                                                .note(sr.getNote())
                                                .imageUrl(sr.getImageUrl())
                                                .doctorName(sr.getDoctor() != null
                                                                ? sr.getDoctor().getUser().getFullName()
                                                                : null)
                                                .createdAt(sr.getCreatedAt())
                                                .build())
                                .toList();
        }
}
