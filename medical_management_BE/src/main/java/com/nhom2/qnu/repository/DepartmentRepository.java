package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Department;
import com.nhom2.qnu.model.Doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {

}
