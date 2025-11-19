package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Doctor;

import java.util.List;

import java.util.Optional;
import com.nhom2.qnu.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    List<Doctor> findByDepartment_DepartmentId(String departmentId);

    Optional<Doctor> findByUser_UserId(String userId);

    Optional<Doctor> findByUser(User user);
}
