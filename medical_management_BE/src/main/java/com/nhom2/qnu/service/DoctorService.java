package com.nhom2.qnu.service;

import java.util.List;

import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.DoctorResponse;

public interface DoctorService {
    DoctorResponse createDoctors(DoctorRequest request);

    DoctorResponse updateDoctors(DoctorRequest request, String id);

    DoctorResponse findDoctorServiceImpl(String id);

    List<DoctorResponse> findAllDoctors();

    public List<DoctorResponse> findByDepartmentId(String departmentId);
}
