package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.*;
import com.nhom2.qnu.payload.request.EHealthRecordsRequest;
import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.*;
import com.nhom2.qnu.repository.EHealthRecordsRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.ServiceResultRepository;
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
    private ServiceResultRepository serviceResultRepository;

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
        List<EHealthRecordsResponse> responses = new ArrayList<>();
        for (EHealthRecords item : eHealthRecords) {
            responses.add(setupResponse(item));
        }
        return responses;
    }

    @Override
    public EHealthRecordsResponse createEHealthRecord(PatientRequest request, String patientId) {

        Patients patient = patientsRepository.findByPatientId(patientId)
                .orElseThrow(() -> new DataNotFoundException("patient does not exist"));

        EHealthRecords record = new EHealthRecords();
        record.setPatient(patient);
        record.setOtherInfo(request.getOtherInfoEHealth());

        return setupResponse(eHealthRecordsRepository.save(record));
    }

    @Override
    public EHealthRecordsResponse updateEHealthRecord(EHealthRecordsRequest request, String id) {

        EHealthRecords record = eHealthRecordsRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Record not found"));

        record.setOtherInfo(request.getOtherInfo());

        return setupResponse(eHealthRecordsRepository.save(record));
    }

    // ========================================================================
    // MAIN RESPONSE BUILDER
    // ========================================================================
    public EHealthRecordsResponse setupResponse(EHealthRecords record) {

        // -------------------------------------
        // PATIENT INFO
        // -------------------------------------
        PatientResponse patient = new PatientResponse();
        patient.setPatientId(record.getPatient().getPatientId());
        patient.setFullName(record.getPatient().getUser().getFullName());
        patient.setDateOfBirth(record.getPatient().getUser().getDateOfBirth());
        patient.setContactNumber(record.getPatient().getUser().getPhoneNumber());
        patient.setAddress(record.getPatient().getUser().getAddress());
        patient.setEmail(record.getPatient().getUser().getEmail());
        patient.setOtherInfo(record.getPatient().getOtherInfo());

        // -------------------------------------
        // MEDICAL HISTORIES
        // -------------------------------------
        List<MedicalHistoriesResponse> medicalResponses = new ArrayList<>();

        if (Objects.nonNull(record.getMedicalHistories())) {
            for (MedicalHistories mh : record.getMedicalHistories()) {

                MedicalHistoriesResponse mhRes = new MedicalHistoriesResponse();
                mhRes.setMedicalHistoryId(mh.getMedicalHistoryId());
                mhRes.setTestResults(mh.getTestResults());
                mhRes.setAdmissionDate(mh.getAdmissionDate());
                mhRes.setDischargeDate(mh.getDischargeDate());

                // DOCTOR of this medical history
                if (mh.getDoctor() != null && mh.getDoctor().getUser() != null) {
                    DoctorResponse dr = new DoctorResponse();
                    dr.setDoctorId(mh.getDoctor().getDoctorId());
                    dr.setDoctorName(mh.getDoctor().getUser().getFullName());
                    dr.setEmail(mh.getDoctor().getUser().getEmail());
                    dr.setContactNumber(mh.getDoctor().getUser().getPhoneNumber());
                    dr.setExperience(mh.getDoctor().getExperience());
                    mhRes.setDoctor(dr);
                }

                // SERVICES USED
                List<ServiceResult> serviceResults = serviceResultRepository.findByMedicalHistory(mh);

                List<ServiceResponse> serviceResponses = new ArrayList<>();

                for (ServiceResult sr : serviceResults) {

                    if (sr.getService() != null) {

                        ServiceResponse s = new ServiceResponse();
                        s.setServiceId(sr.getService().getServiceId());
                        s.setServiceName(sr.getService().getServiceName());
                        s.setDescription(sr.getService().getDescription());

                        serviceResponses.add(s);
                    }
                }

                mhRes.setServices(serviceResponses);

                medicalResponses.add(mhRes);
            }
        }

        // -------------------------------------
        // DOCTORS OF RECORD
        // -------------------------------------
        List<DoctorResponse> doctorResponses = new ArrayList<>();
        if (Objects.nonNull(record.getDoctors())) {
            for (Doctor item : record.getDoctors()) {

                if (item.getUser() == null)
                    continue;

                DoctorResponse dr = new DoctorResponse();
                dr.setDoctorId(item.getDoctorId());
                dr.setDoctorName(item.getUser().getFullName());
                dr.setExperience(item.getExperience());
                dr.setContactNumber(item.getUser().getPhoneNumber());
                dr.setEmail(item.getUser().getEmail());

                doctorResponses.add(dr);
            }
        }

        // -------------------------------------
        // APPOINTMENT SCHEDULES
        // -------------------------------------
        List<AppointmentSchedulesResponse> scheduleResponses = new ArrayList<>();

        if (record.getPatient().getAppointmentSchedules() != null) {
            for (AppointmentSchedules item : record.getPatient().getAppointmentSchedules()) {

                AppointmentSchedulesResponse res = new AppointmentSchedulesResponse();
                res.setAppointmentScheduleId(item.getAppointmentScheduleId());
                res.setAppointmentDatetime(item.getAppointmentDatetime());
                res.setStatus(item.getStatus());

                if (item.getDoctor() != null && item.getDoctor().getUser() != null) {

                    DoctorResponse dr = new DoctorResponse();
                    dr.setDoctorId(item.getDoctor().getDoctorId());
                    dr.setDoctorName(item.getDoctor().getUser().getFullName());
                    dr.setExperience(item.getDoctor().getExperience());
                    dr.setContactNumber(item.getDoctor().getUser().getPhoneNumber());
                    dr.setEmail(item.getDoctor().getUser().getEmail());

                    res.setDoctor(dr);
                }

                scheduleResponses.add(res);
            }
        }

        // -------------------------------------
        // FINAL RETURN OBJECT
        // -------------------------------------
        return new EHealthRecordsResponse(
                record.getRecordId(),
                patient,
                record.getOtherInfo(),
                medicalResponses,
                doctorResponses,
                scheduleResponses);
    }
}
