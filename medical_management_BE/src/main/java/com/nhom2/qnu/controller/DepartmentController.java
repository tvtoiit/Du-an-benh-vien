package com.nhom2.qnu.controller;

import com.nhom2.qnu.payload.response.DepartmentResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.service.DepartmentService;
import com.nhom2.qnu.service.DoctorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<DepartmentResponse> getAllDepartments() {
        return departmentService.getAllDepartments();
    }
}
