package com.nhom2.qnu.service;

import com.nhom2.qnu.payload.request.MedicalHistoriesRequest;
import com.nhom2.qnu.payload.response.MedicalHistoriesResponse;

public interface MedicalHistoriesService {
    MedicalHistoriesResponse createMedicalHistories(MedicalHistoriesRequest request);

    MedicalHistoriesResponse updateMedicalHistories(MedicalHistoriesRequest request, String medicalHistoryId);
}
