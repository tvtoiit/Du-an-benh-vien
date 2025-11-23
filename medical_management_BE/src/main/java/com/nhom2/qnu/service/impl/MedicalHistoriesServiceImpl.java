package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.EHealthRecords;
import com.nhom2.qnu.model.MedicalHistories;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.payload.request.MedicalHistoriesRequest;
import com.nhom2.qnu.payload.response.MedicalHistoriesResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
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

    @Autowired
    AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public MedicalHistoriesResponse createMedicalHistories(MedicalHistoriesRequest request) {

        // Build nội dung khám ban đầu
        String testResults = request.getTestResults();
        if (testResults == null || testResults.trim().isEmpty()) {
            testResults = "Triệu chứng: " + nullSafe(request.getSymptom()) + "\n" +
                    "Kết quả khám ban đầu: " + nullSafe(request.getResult()) + "\n" +
                    "Chẩn đoán chính: " + nullSafe(request.getDiagnosis()) + "\n" +
                    "Chẩn đoán phụ: " + nullSafe(request.getSecondaryDiagnosis()) + "\n" +
                    "Ghi chú: " + nullSafe(request.getNote());
        }

        // chỉ return để FE biết đã lưu phiếu khám
        MedicalHistoriesResponse response = new MedicalHistoriesResponse();
        response.setTestResults(testResults);
        response.setAdmissionDate(new Date());
        response.setDischargeDate(new Date());

        return response;
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

    // Tạo api để bác sĩ kết luận bệnh cho bệnh nhân
    @Transactional
    public MedicalHistoriesResponse conclude(MedicalHistoriesRequest request) {

        Patients patient = patientsRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Doctor not found"));

        MedicalHistories mh = new MedicalHistories();
        mh.setTestResults(request.getTestResults());
        mh.setAdmissionDate(new Date());
        mh.setDischargeDate(new Date());

        MedicalHistories saved = medicalHistoriesRepository.save(mh);

        EHealthRecords record = eHealthRecordsRepository.findByPatientPatientId(patient.getPatientId());
        if (record == null) {
            record = new EHealthRecords();
            record.setPatient(patient);
            record.setMedicalHistories(new HashSet<>());
            record.setDoctors(new HashSet<>());
        }

        record.getMedicalHistories().add(saved);
        record.getDoctors().add(doctor);

        eHealthRecordsRepository.save(record);

        // 4. Update status của lịch khám thành "Hoàn thành"
        AppointmentSchedules appointment = appointmentRepository
                .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(patient.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("No appointment found"));

        appointment.setStatus("Hoàn thành");
        appointmentRepository.save(appointment);

        return setupResponse(saved);
    }

}
