package com.nhom2.qnu.service.impl;

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
                                .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(request.getPatientId())
                                .orElseThrow(() -> new RuntimeException("No appointment found for patient"));

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

                // 6) Cập nhật trạng thái lịch khám
                String status = request.getStatus();

                if ("Đang thực hiện".equalsIgnoreCase(status)) {
                        appointment.setStatus("Đang cận lâm sàng");
                        appointmentRepository.save(appointment);
                }

                if ("Hoàn thành".equalsIgnoreCase(status)) {
                        boolean allDone = serviceResultRepository
                                        .findAllByAppointmentSchedule_AppointmentScheduleId(
                                                        appointment.getAppointmentScheduleId())
                                        .stream()
                                        .allMatch(r -> "Hoàn thành".equalsIgnoreCase(r.getStatus()));

                        if (allDone) {
                                appointment.setStatus("Đã có kết quả CLS");
                                appointmentRepository.save(appointment);
                        }
                }

                // "Chưa làm" → không đổi trạng thái
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
                        if ("Đã thanh toán".equalsIgnoreCase(latest.getStatus())) {
                                continue;
                        }

                        // 4. Xác định trạng thái hiển thị FE dựa vào status của lần khám
                        String type = mapStatus(latest.getStatus());

                        // 5. Tạo response
                        result.add(PatientWithResultResponse.builder()
                                        .patientId(p.getPatientId())
                                        .fullName(p.getUser().getFullName())
                                        .dateOfBirth(p.getDateOfBirth())
                                        .contactNumber(p.getUser().getPhoneNumber())
                                        .status(type)
                                        .build());
                }

                return result;
        }

        private String mapStatus(String status) {
                if (status == null)
                        return "Đã tiếp nhận";

                switch (status) {
                        case "Chờ khám":
                                return "Đã tiếp nhận";

                        case "Đang khám":
                                return "Đang khám";

                        case "Chỉ định CLS":
                                return "Chờ thực hiện CLS";

                        case "Đã có kết quả CLS":
                                return "Kết quả CLS";

                        case "Đã kết luận":
                                return "Đã kết luận";

                        case "Đã kê đơn":
                                return "Đã kê đơn thuốc";

                        default:
                                return "Đã tiếp nhận";
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

                                        if ("Đã kết luận".equalsIgnoreCase(status)
                                                        || "Đã kê đơn".equalsIgnoreCase(status)) {

                                                return PatientWithResultResponse.builder()
                                                                .patientId(p.getPatientId())
                                                                .fullName(p.getUser().getFullName())
                                                                .dateOfBirth(p.getDateOfBirth())
                                                                .contactNumber(p.getUser().getPhoneNumber())
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
                List<ServiceResult> list = serviceResultRepository
                                .findByPatient_PatientIdAndStatus(patientId, "Hoàn thành");

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
