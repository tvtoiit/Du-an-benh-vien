package com.nhom2.qnu.service;

import java.util.List;

import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.DoctorResponse;

public interface DoctorService {
    DoctorResponse createDoctors(DoctorRequest request);
    DoctorResponse updateDoctors(DoctorRequest request, String id);
    DoctorResponse finđDoctorServiceImpl(String id);
    List<DoctorResponse> findAllDoctors();
}
