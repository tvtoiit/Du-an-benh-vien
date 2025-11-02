package com.nhom2.qnu.service.impl;

import com.mysql.cj.xdevapi.DbDoc;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.EHealthRecords;
import com.nhom2.qnu.model.MedicalHistories;
import com.nhom2.qnu.payload.request.MedicalHistoriesRequest;
import com.nhom2.qnu.payload.response.MedicalHistoriesResponse;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.EHealthRecordsRepository;
import com.nhom2.qnu.repository.MedicalHistoriesRepository;
import com.nhom2.qnu.service.MedicalHistoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class MedicalHistoriesServiceImpl implements MedicalHistoriesService {

    @Autowired
    private MedicalHistoriesRepository medicalHistoriesRepository;
    @Autowired
    private EHealthRecordsRepository eHealthRecordsRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Override
    @Transactional
    public MedicalHistoriesResponse createMedicalHistories(MedicalHistoriesRequest request) {

        MedicalHistories medicalHistories = new MedicalHistories();
        medicalHistories.setTestResults(request.getTestResults());
        medicalHistories.setAdmissionDate(request.getAdmissionDate());
        medicalHistories.setDischargeDate(request.getDischargeDate());

        MedicalHistories newMedicalHistories = medicalHistoriesRepository.save(medicalHistories);

        EHealthRecords eHealthRecords = eHealthRecordsRepository.findByPatientPatientId(request.getPatientId());

        eHealthRecords.getMedicalHistories().add(newMedicalHistories);
        eHealthRecordsRepository.save(eHealthRecords);

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(()-> new DataNotFoundException("Doctor does not exist"));
        eHealthRecords.getDoctors().add(doctor);

        return setupResponse(newMedicalHistories);
    }

    @Override
    public MedicalHistoriesResponse updateMedicalHistories(MedicalHistoriesRequest request, String medicalHistoryId) {
        MedicalHistories medicalHistories = medicalHistoriesRepository.findById(medicalHistoryId)
                .orElseThrow(()-> new DataNotFoundException("Medical Histories does not exist"));
        medicalHistories.setTestResults(request.getTestResults());
        medicalHistories.setAdmissionDate(request.getAdmissionDate());
        medicalHistories.setDischargeDate(request.getDischargeDate());

        MedicalHistories updateMedicalHistories = medicalHistoriesRepository.save(medicalHistories);

        return setupResponse(updateMedicalHistories);
    }

    public MedicalHistoriesResponse setupResponse(MedicalHistories medicalHistories){
        MedicalHistoriesResponse response = new MedicalHistoriesResponse();
        response.setMedicalHistoryId(medicalHistories.getMedicalHistoryId());
        response.setTestResults(medicalHistories.getTestResults());
        response.setAdmissionDate(medicalHistories.getAdmissionDate());
        response.setDischargeDate(medicalHistories.getDischargeDate());
        return response;
    }
}
