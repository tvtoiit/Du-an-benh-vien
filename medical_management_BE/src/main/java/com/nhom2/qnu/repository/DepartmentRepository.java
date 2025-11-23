package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Department;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    boolean existsByName(String name);
}
