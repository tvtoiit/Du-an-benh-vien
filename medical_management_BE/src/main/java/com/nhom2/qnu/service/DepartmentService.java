package com.nhom2.qnu.service;

import com.nhom2.qnu.payload.response.DepartmentResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponse> getAllDepartments();
}
