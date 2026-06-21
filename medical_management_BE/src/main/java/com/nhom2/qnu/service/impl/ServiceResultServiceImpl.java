package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.enums.ServiceType;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.ServiceResult;
import com.nhom2.qnu.model.Services;
import com.nhom2.qnu.payload.request.ServiceResultRequest;
import com.nhom2.qnu.payload.response.PatientWithResultResponse;
import com.nhom2.qnu.payload.response.ServiceResultResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.MedicalHistoriesRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.PrescriptionHistoryRepository;
import com.nhom2.qnu.repository.ServiceResultRepository;
import com.nhom2.qnu.repository.ServicesRepository;
import com.nhom2.qnu.service.ServiceResultService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ServiceResultServiceImpl implements ServiceResultService {

        private final ServiceResultRepository serviceResultRepository;
        private final PatientsRepository patientRepository;
        private final ServicesRepository servicesRepository;
        private final DoctorRepository doctorRepository;
        private final AppointmentRepository appointmentRepository;
        private final PrescriptionHistoryRepository prescriptionHistoryRepository;
        private final MedicalHistoriesRepository medicalHistoryRepository;

        public ServiceResultServiceImpl(ServiceResultRepository serviceResultRepository,
                        PatientsRepository patientRepository,
                        ServicesRepository servicesRepository,
                        DoctorRepository doctorRepository,
                        AppointmentRepository appointmentRepository,
                        PrescriptionHistoryRepository prescriptionHistoryRepository,
                        MedicalHistoriesRepository medicalHistoryRepository) {
                this.serviceResultRepository = serviceResultRepository;
                this.patientRepository = patientRepository;
                this.servicesRepository = servicesRepository;
                this.doctorRepository = doctorRepository;
                this.appointmentRepository = appointmentRepository;
                this.medicalHistoryRepository = medicalHistoryRepository;
                this.prescriptionHistoryRepository = prescriptionHistoryRepository;
        }

        @Override
        public ServiceResult saveServiceResult(ServiceResultRequest request) throws IOException {

                // 1) Lấy dữ liệu bệnh nhân
                Patients patient = patientRepository.findById(request.getPatientId())
                                .orElseThrow(() -> new RuntimeException("Patient not found"));

                // 2) Lấy lịch khám mới nhất của bệnh nhân
                AppointmentSchedules appointment = appointmentRepository
                                .findById(request.getAppointmentId())
                                .orElseThrow(
                                                () -> new RuntimeException("Appointment not found"));

                // 3) Tạo kết quả CLS
                ServiceResult result = new ServiceResult();
                result.setPatient(patient);

                Services service = servicesRepository.findById(request.getServiceId())
                                .orElseThrow(() -> new RuntimeException("Service not found"));
                result.setService(service);

                result.setAppointmentSchedule(appointment);
                result.setStatus(request.getStatus());
                result.setResultData(request.getResultData());
                result.setNote(request.getNote());
                result.setCreatedAt(LocalDateTime.now());

                // 4) Xử lý file hình ảnh (nếu có)
                MultipartFile file = request.getImageFile();
                if (file != null && !file.isEmpty()) {
                        String fileUrl = "/uploads/" + file.getOriginalFilename();
                        result.setImageUrl(fileUrl);
                }

                // 5) Lưu kết quả
                ServiceResult saved = serviceResultRepository.save(result);

                long totalClinicalServices = appointment.getAppointmentServices()
                                .stream()
                                .filter(item -> item.getService().getServiceType() == ServiceType.CLINICAL)
                                .count();

                long totalResults = serviceResultRepository
                                .countByAppointmentSchedule_AppointmentScheduleId(
                                                appointment.getAppointmentScheduleId());

                if (totalClinicalServices > 0
                                && totalResults >= totalClinicalServices) {

                        appointment.setStatus("Kết quả CLS");

                        appointmentRepository.save(appointment);
                }

                return saved;
        }

        @Override
        public List<PatientWithResultResponse> getPatientsWithCompletedResults() {

                // 1. Lấy toàn bộ bệnh nhân (hoặc bạn có thể lọc theo điều kiện)
                List<Patients> allPatients = patientRepository.findAll();

                List<PatientWithResultResponse> result = new ArrayList<>();

                for (Patients p : allPatients) {

                        // 2. Lấy cuộc hẹn mới nhất của bệnh nhân
                        Optional<AppointmentSchedules> latestOpt = appointmentRepository
                                        .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(
                                                        p.getPatientId());

                        if (latestOpt.isEmpty())
                                continue; // chưa có lần khám nào → bỏ qua

                        AppointmentSchedules latest = latestOpt.get();

                        // 3. Nếu lần khám mới nhất đã thanh toán → không hiển thị nữa
                        String status = latest.getStatus();

                        boolean isValidStatus = "Chờ khám".equalsIgnoreCase(status)
                                        || "Chờ kết luận".equalsIgnoreCase(status)
                                        || "Kết quả CLS".equalsIgnoreCase(status);

                        if (!isValidStatus) {
                                continue;
                        }

                        // 4. Xác định trạng thái hiển thị FE dựa vào status của lần khám
                        String type = mapStatus(latest.getStatus());

                        // 5. Tạo response
                        result.add(PatientWithResultResponse.builder()
                                        .patientId(p.getPatientId())
                                        .appointmentScheduleId(
                                                        latest.getAppointmentScheduleId())
                                        .fullName(p.getUser().getFullName())
                                        .dateOfBirth(p.getUser().getDateOfBirth())
                                        .contactNumber(p.getUser().getPhoneNumber())
                                        .cccd(p.getUser().getCcCongDan())
                                        .status(type)
                                        .build());
                }

                return result;
        }

        private String mapStatus(String status) {

                if (status == null) {
                        return "";
                }

                switch (status) {

                        case "Kết quả CLS":
                                return "Kết quả CLS";

                        case "Chờ khám":
                                return "Chờ khám";

                        case "Chờ kết luận":
                                return "Chờ kết luận";

                        default:
                                return status;
                }
        }

        @Override
        public List<PatientWithResultResponse> getPatientsWithCompletedResultsKeDon() {

                // Lấy toàn bộ bệnh nhân có medical history (đã khám)
                List<Patients> patients = medicalHistoryRepository.findPatientsWithConclusion();

                return patients.stream()
                                .map(p -> {

                                        var latestOpt = appointmentRepository
                                                        .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(
                                                                        p.getPatientId());

                                        if (latestOpt.isEmpty())
                                                return null;

                                        var latest = latestOpt.get();
                                        String status = latest.getStatus();

                                        if ("Chờ kê đơn".equalsIgnoreCase(status)
                                                        || "Đã kê đơn".equalsIgnoreCase(status)) {

                                                return PatientWithResultResponse.builder()
                                                                .patientId(p.getPatientId())
                                                                .fullName(p.getUser().getFullName())
                                                                .dateOfBirth(p.getUser().getDateOfBirth())
                                                                .contactNumber(p.getUser().getPhoneNumber())
                                                                .cccd(p.getUser().getCcCongDan())
                                                                .status(status)
                                                                .appointmentScheduleId(
                                                                                latest.getAppointmentScheduleId())
                                                                .build();
                                        }

                                        return null;
                                })
                                .filter(Objects::nonNull)
                                .toList();

        }

        @Override
        public List<ServiceResultResponse> getCompletedResultsByPatient(String patientId) {
                // List<ServiceResult> list = serviceResultRepository
                // .findByPatient_PatientIdAndStatus(patientId, "Hoàn thành");
                List<ServiceResult> list = serviceResultRepository
                                .findByPatient_PatientId(patientId);

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

        @Override
        public List<ServiceResultResponse> getResultsByAppointment(
                        String appointmentId) {

                List<ServiceResult> list = serviceResultRepository
                                .findByAppointmentSchedule_AppointmentScheduleId(
                                                appointmentId);

                return list.stream()
                                .map(sr -> ServiceResultResponse.builder()
                                                .resultId(sr.getResultId())
                                                .serviceName(sr.getService().getServiceName())
                                                .resultData(sr.getResultData())
                                                .note(sr.getNote())
                                                .imageUrl(sr.getImageUrl())
                                                .createdAt(sr.getCreatedAt())
                                                .build())
                                .toList();
        }
}
