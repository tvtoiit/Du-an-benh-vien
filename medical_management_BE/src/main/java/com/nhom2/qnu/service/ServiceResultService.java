package com.nhom2.qnu.service;

import com.nhom2.qnu.payload.request.ServiceResultRequest;
import com.nhom2.qnu.model.ServiceResult;
import com.nhom2.qnu.payload.response.PatientWithResultResponse;
import com.nhom2.qnu.payload.response.ServiceResultResponse;

import java.io.IOException;
import java.util.List;

public interface ServiceResultService {
    ServiceResult saveServiceResult(ServiceResultRequest request) throws IOException;
    List<ServiceResultResponse> getCompletedResultsByPatient(String patientId);
    List<PatientWithResultResponse> getPatientsWithCompletedResults(String doctorId);
}
