package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.*;
import com.nhom2.qnu.payload.request.EHealthRecordsRequest;
import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.*;
import com.nhom2.qnu.repository.EHealthRecordsRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.service.EHealthRecordsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class EHealthRecordsServiceImpl implements EHealthRecordsService {

    @Autowired
    private PatientsRepository patientsRepository;

    @Autowired
    private EHealthRecordsRepository eHealthRecordsRepository;

    @Override
    public EHealthRecordsResponse getEHealthRecordByPatient(String patientId) {

        EHealthRecords eHealthRecords = eHealthRecordsRepository.findByPatientPatientId(patientId);

        return setupResponse(eHealthRecords);
    }

    @Override
    public List<EHealthRecordsResponse> getAllEHealthRecord() {

        List<EHealthRecords> eHealthRecords = eHealthRecordsRepository.findAll();
        List<EHealthRecordsResponse> eHealthRecordsResponses = new ArrayList<>();
        for (EHealthRecords item : eHealthRecords) {
            eHealthRecordsResponses.add(setupResponse(item));
        }
        return eHealthRecordsResponses;
    }

    @Override
    public EHealthRecordsResponse createEHealthRecord(PatientRequest request, String patientId) {

        Patients patient = patientsRepository.findByPatientId(patientId)
                .orElseThrow(() -> new DataNotFoundException("patient does not exist"));

        EHealthRecords eHealthRecords = new EHealthRecords();
        eHealthRecords.setPatient(patient);
        eHealthRecords.setOtherInfo(request.getOtherInfoEHealth());

        EHealthRecords newEHealthRecords = eHealthRecordsRepository.save(eHealthRecords);

        return setupResponse(newEHealthRecords);
    }

    @Override
    public EHealthRecordsResponse updateEHealthRecord(EHealthRecordsRequest request, String eHealthRecordId) {

        EHealthRecords eHealthRecords = eHealthRecordsRepository.findById(eHealthRecordId)
                .orElseThrow(() -> new DataNotFoundException("EHealthRecords does not exist"));
        eHealthRecords.setOtherInfo(request.getOtherInfo());
        EHealthRecords updateEHealthRecords = eHealthRecordsRepository.save(eHealthRecords);

        return setupResponse(updateEHealthRecords);
    }

    public EHealthRecordsResponse setupResponse(EHealthRecords eHealthRecords) {

        PatientResponse patientResponse = new PatientResponse();
        patientResponse.setPatientId(eHealthRecords.getPatient().getPatientId());
        patientResponse.setFullName(eHealthRecords.getPatient().getUser().getFullName());
        patientResponse.setDateOfBirth(eHealthRecords.getPatient().getDateOfBirth());
        patientResponse.setContactNumber(eHealthRecords.getPatient().getUser().getPhoneNumber());
        patientResponse.setAddress(eHealthRecords.getPatient().getUser().getAddress());
        patientResponse.setEmail(eHealthRecords.getPatient().getUser().getEmail());
        patientResponse.setOtherInfo(eHealthRecords.getPatient().getOtherInfo());

        List<MedicalHistoriesResponse> medicalHistoriesResponseList = new ArrayList<>();
        if (Objects.nonNull(eHealthRecords.getMedicalHistories())) {

            for (MedicalHistories item : eHealthRecords.getMedicalHistories()) {
                MedicalHistoriesResponse medicalHistoriesResponse = new MedicalHistoriesResponse();
                medicalHistoriesResponse.setMedicalHistoryId(item.getMedicalHistoryId());
                medicalHistoriesResponse.setTestResults(item.getTestResults());
                medicalHistoriesResponse.setAdmissionDate(item.getAdmissionDate());
                medicalHistoriesResponse.setDischargeDate(item.getDischargeDate());

                medicalHistoriesResponseList.add(medicalHistoriesResponse);
            }
        }

        List<DoctorResponse> doctorResponseList = new ArrayList<>();
        if (Objects.nonNull(eHealthRecords.getDoctors())) {

            for (Doctor item : eHealthRecords.getDoctors()) {
                DoctorResponse doctorResponse = new DoctorResponse();
                doctorResponse.setDoctorId(item.getDoctorId());
                doctorResponse.setDoctorName(item.getUser().getFullName());
                doctorResponse.setExperience(item.getExperience());
                doctorResponse.setContactNumber(item.getUser().getPhoneNumber());
                doctorResponse.setEmail(item.getUser().getEmail());

                doctorResponseList.add(doctorResponse);
            }
        }

        List<AppointmentSchedulesResponse> schedulesResponses = new ArrayList<>();
        if (Objects.nonNull(eHealthRecords.getPatient().getAppointmentSchedules())) {

            for (AppointmentSchedules item : eHealthRecords.getPatient().getAppointmentSchedules()) {
                AppointmentSchedulesResponse appointmentSchedulesResponse = new AppointmentSchedulesResponse();
                appointmentSchedulesResponse.setAppointmentScheduleId(item.getAppointmentScheduleId());
                appointmentSchedulesResponse.setAppointmentDatetime(item.getAppointmentDatetime());

                DoctorResponse doctorResponse = new DoctorResponse();
                doctorResponse.setDoctorId(item.getDoctor().getDoctorId());
                doctorResponse.setDoctorName(item.getDoctor().getUser().getFullName());
                doctorResponse.setExperience(item.getDoctor().getExperience());
                doctorResponse.setContactNumber(item.getDoctor().getUser().getPhoneNumber());
                doctorResponse.setEmail(item.getDoctor().getUser().getEmail());

                appointmentSchedulesResponse.setDoctor(doctorResponse);
                appointmentSchedulesResponse.setStatus(item.getStatus());

                schedulesResponses.add(appointmentSchedulesResponse);
            }
        }

        EHealthRecordsResponse response = new EHealthRecordsResponse(eHealthRecords.getRecordId(),
                patientResponse, eHealthRecords.getOtherInfo(), medicalHistoriesResponseList, doctorResponseList,
                schedulesResponses);
        return response;
    }
}
