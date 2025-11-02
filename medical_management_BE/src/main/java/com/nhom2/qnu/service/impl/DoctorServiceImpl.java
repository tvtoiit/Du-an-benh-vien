package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.AccessDeniedException;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.UserRepository;
import com.nhom2.qnu.service.DoctorService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorServiceImpl implements DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public DoctorResponse createDoctors(DoctorRequest request) {
        // Tạo object Doctor
        Doctor doctor = new Doctor();

        // Lấy user theo userId
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        doctor.setUser(user);

        // Chỉ set chuyên môn cho Doctor
        doctor.setSpecialization(request.getSpecialization());

        // Lưu vào repository
        Doctor newDoctor = doctorRepository.save(doctor);

        // Tạo response
        DoctorResponse response = new DoctorResponse(
                newDoctor.getDoctorId(),
                newDoctor.getUser().getFullName(),
                newDoctor.getSpecialization(),
                newDoctor.getUser().getPhoneNumber(),
                newDoctor.getUser().getEmail());

        return response;
    }

    @Override
    public DoctorResponse updateDoctors(DoctorRequest request, String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new AccessDeniedException(
                        new ApiResponse(Boolean.FALSE, "You can't update doctors!")));

        // Update thông tin user
        User user = doctor.getUser();
        user.setFullName(request.getDoctorName());
        user.setPhoneNumber(request.getContactNumber());
        user.setEmail(request.getEmail());

        // Update chuyên môn bác sĩ
        doctor.setSpecialization(request.getSpecialization());

        Doctor updatedDoctor = doctorRepository.save(doctor);

        DoctorResponse doctorResponse = new DoctorResponse();
        doctorResponse.setDoctorId(updatedDoctor.getDoctorId());
        doctorResponse.setDoctorName(updatedDoctor.getUser().getFullName());
        doctorResponse.setSpecialization(updatedDoctor.getSpecialization());
        doctorResponse.setContactNumber(updatedDoctor.getUser().getPhoneNumber());
        doctorResponse.setEmail(updatedDoctor.getUser().getEmail());
        return doctorResponse;
    }

    @Override
    public List<DoctorResponse> findAllDoctors() {
        List<Doctor> doctorsList = doctorRepository.findAll();
        List<DoctorResponse> doctorResponses = new ArrayList<>();

        for (Doctor doctor : doctorsList) {
            DoctorResponse response = new DoctorResponse();
            response.setDoctorId(doctor.getDoctorId());
            response.setDoctorName(doctor.getUser().getFullName());
            response.setSpecialization(doctor.getSpecialization());
            response.setContactNumber(doctor.getUser().getPhoneNumber());
            response.setEmail(doctor.getUser().getEmail());
            doctorResponses.add(response);
        }

        return doctorResponses;
    }

    @Override
    public DoctorResponse finđDoctorServiceImpl(String id) {
        Doctor doctor = doctorRepository.findById(id).get();
        DoctorResponse response = new DoctorResponse();
        response.setDoctorId(doctor.getDoctorId());
        response.setDoctorName(doctor.getUser().getFullName());
        response.setSpecialization(doctor.getSpecialization());
        response.setContactNumber(doctor.getUser().getPhoneNumber());
        response.setEmail(doctor.getUser().getEmail());
        return response;
    }

}
