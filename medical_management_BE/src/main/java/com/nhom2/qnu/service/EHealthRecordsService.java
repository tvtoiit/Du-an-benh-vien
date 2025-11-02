package com.nhom2.qnu.service;

import com.nhom2.qnu.payload.request.EHealthRecordsRequest;
import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.EHealthRecordsResponse;

import java.util.List;

public interface EHealthRecordsService {

    EHealthRecordsResponse getEHealthRecordByPatient(String patientId);

    List<EHealthRecordsResponse> getAllEHealthRecord();

    EHealthRecordsResponse createEHealthRecord(PatientRequest request, String patientId);

    EHealthRecordsResponse updateEHealthRecord(EHealthRecordsRequest request, String eHealthRecordId);
}
