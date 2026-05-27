package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Role;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.RoleRepository;
import com.nhom2.qnu.repository.UserRepository;
import com.nhom2.qnu.service.DoctorService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public DoctorResponse createDoctors(DoctorRequest request) {

        // tìm user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        // check đã là doctor chưa
        if (doctorRepository.existsByUser(user)) {
            throw new RuntimeException("User đã là bác sĩ!");
        }

        // set role bác sĩ
        Role doctorRole = roleRepository.findByName("ROLE_BACSI")
                .orElseThrow(() -> new DataNotFoundException("Role not found"));

        user.getAccount().setRole(doctorRole);
        userRepository.save(user);

        // tạo doctor
        Doctor doctor = new Doctor();

        doctor.setUser(user);
        doctor.setDegree(request.getDegree());
        doctor.setConsultationFee(request.getConsultationFee());

        Doctor savedDoctor = doctorRepository.save(doctor);

        return convertToResponse(savedDoctor);
    }

    @Override
    public DoctorResponse updateDoctors(String id, DoctorRequest request) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Doctor not found"));

        // cập nhật trình độ
        if (request.getDegree() != null) {
            doctor.setDegree(request.getDegree());
        }

        // cập nhật phí khám
        if (request.getConsultationFee() != null) {
            doctor.setConsultationFee(request.getConsultationFee());
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);

        return convertToResponse(updatedDoctor);
    }

    @Override
    public List<DoctorResponse> findAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorResponse findDoctorServiceImpl(String id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Doctor not found"));

        return convertToResponse(doctor);
    }

    private DoctorResponse convertToResponse(Doctor doctor) {

        DoctorResponse response = new DoctorResponse();

        response.setDoctorId(doctor.getDoctorId());

        response.setDoctorName(
                doctor.getUser().getFullName());

        response.setDegree(
                doctor.getDegree());

        response.setConsultationFee(
                doctor.getConsultationFee());

        response.setContactNumber(
                doctor.getUser().getPhoneNumber());

        response.setEmail(
                doctor.getUser().getEmail());

        response.setCccd(
                doctor.getUser().getCcCongDan());

        return response;
    }
}