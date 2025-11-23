package com.nhom2.qnu.service;

import com.nhom2.qnu.model.Department;
import com.nhom2.qnu.payload.response.DepartmentResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;

import java.util.List;

public interface DepartmentService {
    List<Department> getAll();

    Department create(Department department);

    Department update(String id, Department department);

    void delete(String id);
}
