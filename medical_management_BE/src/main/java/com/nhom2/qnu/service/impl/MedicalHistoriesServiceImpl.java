package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.EHealthRecords;
import com.nhom2.qnu.model.MedicalHistories;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.payload.request.MedicalHistoriesRequest;
import com.nhom2.qnu.payload.response.MedicalHistoriesResponse;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.EHealthRecordsRepository;
import com.nhom2.qnu.repository.MedicalHistoriesRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.service.MedicalHistoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashSet;

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

    @Override
    @Transactional
    public MedicalHistoriesResponse createMedicalHistories(MedicalHistoriesRequest request) {

        // 1. Build testResults nếu FE không gửi
        String testResults = request.getTestResults();
        if (testResults == null || testResults.trim().isEmpty()) {
            StringBuilder sb = new StringBuilder();
            sb.append("Triệu chứng: ").append(nullSafe(request.getSymptom())).append("\n")
                    .append("Kết quả khám ban đầu: ").append(nullSafe(request.getResult())).append("\n")
                    .append("Chẩn đoán chính: ").append(nullSafe(request.getDiagnosis())).append("\n")
                    .append("Chẩn đoán phụ: ").append(nullSafe(request.getSecondaryDiagnosis())).append("\n")
                    .append("Ghi chú: ").append(nullSafe(request.getNote()));
            testResults = sb.toString();
        }

        Date now = new Date();
        Date admissionDate = request.getAdmissionDate() != null ? request.getAdmissionDate() : now;
        Date dischargeDate = request.getDischargeDate() != null ? request.getDischargeDate() : now;

        if (request.getPatientId() == null) {
            throw new DataNotFoundException("PatientId is required");
        }

        // 2. Tìm bệnh nhân
        Patients patient = patientsRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("Patient does not exist"));

        // 3. Tìm bác sĩ (nếu có)
        Doctor doctor = null;
        if (request.getDoctorId() != null && !request.getDoctorId().isEmpty()) {
            doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));
        }

        // 4. Tạo bản ghi MedicalHistories
        MedicalHistories medicalHistories = new MedicalHistories();
        medicalHistories.setTestResults(testResults);
        medicalHistories.setAdmissionDate(admissionDate);
        medicalHistories.setDischargeDate(dischargeDate);
        // Nếu entity MedicalHistories có các field này thì set thêm:
        // medicalHistories.setSymptom(request.getSymptom());
        // medicalHistories.setResult(request.getResult());
        // medicalHistories.setDiagnosis(request.getDiagnosis());
        // medicalHistories.setSecondaryDiagnosis(request.getSecondaryDiagnosis());
        // medicalHistories.setNote(request.getNote());
        // medicalHistories.setPatient(patient);
        // if (doctor != null) medicalHistories.setDoctor(doctor);

        MedicalHistories newMedicalHistories = medicalHistoriesRepository.save(medicalHistories);

        // 5. Lấy hoặc tạo EHealthRecords cho bệnh nhân
        EHealthRecords eHealthRecords = eHealthRecordsRepository.findByPatientPatientId(request.getPatientId());

        if (eHealthRecords == null) {
            eHealthRecords = new EHealthRecords();
            eHealthRecords.setPatient(patient);
            // medicalHistories & doctors đã được new HashSet<>() trong entity
        }

        // Phòng trường hợp đã từng bị set null ở đâu đó
        if (eHealthRecords.getMedicalHistories() == null) {
            eHealthRecords.setMedicalHistories(new HashSet<>());
        }
        if (eHealthRecords.getDoctors() == null) {
            eHealthRecords.setDoctors(new HashSet<>());
        }

        // Thêm lịch sử khám vào hồ sơ
        eHealthRecords.getMedicalHistories().add(newMedicalHistories);

        // Thêm bác sĩ vào hồ sơ nếu có
        if (doctor != null && !eHealthRecords.getDoctors().contains(doctor)) {
            eHealthRecords.getDoctors().add(doctor);
        }

        // 6. Lưu lại hồ sơ
        eHealthRecordsRepository.save(eHealthRecords);

        return setupResponse(newMedicalHistories);
    }

    @Override
    public MedicalHistoriesResponse updateMedicalHistories(MedicalHistoriesRequest request,
            String medicalHistoryId) {
        MedicalHistories medicalHistories = medicalHistoriesRepository.findById(medicalHistoryId)
                .orElseThrow(() -> new DataNotFoundException("Medical Histories does not exist"));

        String testResults = request.getTestResults();
        if (testResults == null || testResults.trim().isEmpty()) {
            StringBuilder sb = new StringBuilder();
            sb.append("Triệu chứng: ").append(nullSafe(request.getSymptom())).append("\n")
                    .append("Kết quả khám ban đầu: ").append(nullSafe(request.getResult())).append("\n")
                    .append("Chẩn đoán chính: ").append(nullSafe(request.getDiagnosis())).append("\n")
                    .append("Chẩn đoán phụ: ").append(nullSafe(request.getSecondaryDiagnosis())).append("\n")
                    .append("Ghi chú: ").append(nullSafe(request.getNote()));
            testResults = sb.toString();
        }

        medicalHistories.setTestResults(testResults);
        if (request.getAdmissionDate() != null) {
            medicalHistories.setAdmissionDate(request.getAdmissionDate());
        }
        if (request.getDischargeDate() != null) {
            medicalHistories.setDischargeDate(request.getDischargeDate());
        }

        MedicalHistories updated = medicalHistoriesRepository.save(medicalHistories);
        return setupResponse(updated);
    }

    private String nullSafe(String s) {
        return s == null ? "" : s;
    }

    public MedicalHistoriesResponse setupResponse(MedicalHistories medicalHistories) {
        MedicalHistoriesResponse response = new MedicalHistoriesResponse();
        response.setMedicalHistoryId(medicalHistories.getMedicalHistoryId());
        response.setTestResults(medicalHistories.getTestResults());
        response.setAdmissionDate(medicalHistories.getAdmissionDate());
        response.setDischargeDate(medicalHistories.getDischargeDate());
        return response;
    }
}
