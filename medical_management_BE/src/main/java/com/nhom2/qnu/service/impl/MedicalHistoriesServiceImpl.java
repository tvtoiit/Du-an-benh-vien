package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.*;
import com.nhom2.qnu.payload.request.MedicalHistoriesRequest;
import com.nhom2.qnu.payload.response.MedicalHistoriesResponse;
import com.nhom2.qnu.repository.*;
import com.nhom2.qnu.service.MedicalHistoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MedicalHistoriesServiceImpl implements MedicalHistoriesService {

    @Autowired
    private MedicalHistoriesRepository medicalHistoriesRepository;

    @Autowired
    private EHealthRecordsRepository eHealthRecordsRepository;

    @Autowired
    private PatientsRepository patientsRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ServiceResultRepository serviceResultRepository;

    // ------------------------------------------------------------------------
    // 1. Tạo mẫu phiếu khám (không lưu vào database)
    // ------------------------------------------------------------------------
    @Override
    @Transactional
    public MedicalHistoriesResponse createMedicalHistories(MedicalHistoriesRequest request) {

        Patients patient = patientsRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));

        EHealthRecords record = eHealthRecordsRepository.findByPatientPatientId(patient.getPatientId());
        if (record == null)
            throw new RuntimeException("Không tìm thấy hồ sơ sức khỏe");

        // Tạo lịch sử khám (phiếu khám)
        MedicalHistories history = new MedicalHistories();
        history.setTestResults(buildTestResults(request));
        history.setAdmissionDate(new Date());
        history.setDischargeDate(new Date());
        history.setDoctor(doctor);

        medicalHistoriesRepository.save(history);

        // Gắn vào hồ sơ sức khỏe
        record.getMedicalHistories().add(history);
        eHealthRecordsRepository.save(record);

        // Cập nhật trạng thái của lần khám
        AppointmentSchedules latestAppointment = appointmentRepository
                .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(
                        patient.getPatientId())
                .orElse(null);

        if (latestAppointment != null) {
            latestAppointment.setStatus("Đã kết luận");
            appointmentRepository.save(latestAppointment);
        }

        return MedicalHistoriesResponse.builder()
                .medicalHistoryId(history.getMedicalHistoryId())
                .testResults(history.getTestResults())
                .admissionDate(history.getAdmissionDate())
                .dischargeDate(history.getDischargeDate())
                .doctorId(doctor.getDoctorId())
                .patientId(patient.getPatientId())
                .build();
    }

    private String buildTestResults(MedicalHistoriesRequest req) {
        StringBuilder sb = new StringBuilder();

        if (req.getSymptom() != null && !req.getSymptom().isBlank()) {
            sb.append("Triệu chứng: ").append(req.getSymptom()).append(" | ");
        }
        if (req.getResult() != null && !req.getResult().isBlank()) {
            sb.append("Kết quả khám: ").append(req.getResult()).append(" | ");
        }
        if (req.getDiagnosis() != null && !req.getDiagnosis().isBlank()) {
            sb.append("Chẩn đoán: ").append(req.getDiagnosis()).append(" | ");
        }
        if (req.getSecondaryDiagnosis() != null && !req.getSecondaryDiagnosis().isBlank()) {
            sb.append("Chẩn đoán phụ: ").append(req.getSecondaryDiagnosis()).append(" | ");
        }
        if (req.getNote() != null && !req.getNote().isBlank()) {
            sb.append("Ghi chú: ").append(req.getNote());
        }

        return sb.toString();
    }

    // ------------------------------------------------------------------------
    // 2. Cập nhật kết quả khám
    // ------------------------------------------------------------------------
    @Override
    public MedicalHistoriesResponse updateMedicalHistories(MedicalHistoriesRequest request, String medicalHistoryId) {

        MedicalHistories medicalHistories = medicalHistoriesRepository.findById(medicalHistoryId)
                .orElseThrow(() -> new DataNotFoundException("Medical history not found"));

        String testResults = buildTestResult(request);
        medicalHistories.setTestResults(testResults);

        if (request.getAdmissionDate() != null)
            medicalHistories.setAdmissionDate(request.getAdmissionDate());

        if (request.getDischargeDate() != null)
            medicalHistories.setDischargeDate(request.getDischargeDate());

        MedicalHistories updated = medicalHistoriesRepository.save(medicalHistories);
        return convertToResponse(updated);
    }

    // ========================================================================
    // 3. BÁC SĨ KẾT LUẬN KHÁM (HÀM QUAN TRỌNG NHẤT)
    // ========================================================================
    @Override
    @Transactional
    public MedicalHistoriesResponse conclude(MedicalHistoriesRequest request) {

        // ---------- 1. Lấy bệnh nhân + bác sĩ ----------
        Patients patient = patientsRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("Không tim thấy bệnh nhân"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bác sĩ"));

        // ---------- 2. Tạo hồ sơ khám ----------
        MedicalHistories mh = new MedicalHistories();
        mh.setTestResults(buildTestResult(request));
        mh.setAdmissionDate(new Date());
        mh.setDischargeDate(new Date());
        mh.setDoctor(doctor);

        MedicalHistories savedHistory = medicalHistoriesRepository.save(mh);

        // ---------- 3. Gán vào hồ sơ sức khỏe ----------
        EHealthRecords record = eHealthRecordsRepository.findByPatientPatientId(patient.getPatientId());
        if (record == null) {
            record = new EHealthRecords();
            record.setPatient(patient);
            record.setMedicalHistories(new HashSet<>());
            record.setDoctors(new HashSet<>());
        }

        record.getMedicalHistories().add(savedHistory);
        record.getDoctors().add(doctor);

        eHealthRecordsRepository.save(record);

        // ---------- 4. Gán các dịch vụ đang thực hiện vào hồ sơ khám ----------
        List<ServiceResult> pendingServices = serviceResultRepository.findByPatient_PatientIdAndStatus(
                patient.getPatientId(), "Đang thực hiện");

        for (ServiceResult sr : pendingServices) {
            sr.setMedicalHistory(savedHistory);
            sr.setDoctor(doctor);
            sr.setStatus("Đã kết luận");
            serviceResultRepository.save(sr);
        }

        // ---------- 5. Cập nhật trạng thái lịch khám ----------
        AppointmentSchedules appointment = appointmentRepository
                .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(patient.getPatientId())
                .orElse(null);

        if (appointment != null) {
            appointment.setStatus("Đã kết luận");
            appointmentRepository.save(appointment);
        }

        // ---------- 6. Trả về response ----------
        return convertToResponse(savedHistory);
    }

    // ========================================================================
    // HÀM HỖ TRỢ
    // ========================================================================

    private MedicalHistoriesResponse convertToResponse(MedicalHistories mh) {
        MedicalHistoriesResponse response = new MedicalHistoriesResponse();
        response.setMedicalHistoryId(mh.getMedicalHistoryId());
        response.setTestResults(mh.getTestResults());
        response.setAdmissionDate(mh.getAdmissionDate());
        response.setDischargeDate(mh.getDischargeDate());
        return response;
    }

    private String buildTestResult(MedicalHistoriesRequest request) {

        if (request.getTestResults() != null && !request.getTestResults().trim().isEmpty())
            return request.getTestResults();

        // Build nội dung tự động
        return "Triệu chứng: " + nullSafe(request.getSymptom()) + "\n" +
                "Kết quả khám ban đầu: " + nullSafe(request.getResult()) + "\n" +
                "Chẩn đoán chính: " + nullSafe(request.getDiagnosis()) + "\n" +
                "Chẩn đoán phụ: " + nullSafe(request.getSecondaryDiagnosis()) + "\n" +
                "Ghi chú: " + nullSafe(request.getNote());
    }

    private String nullSafe(String s) {
        return s == null ? "" : s;
    }
}
