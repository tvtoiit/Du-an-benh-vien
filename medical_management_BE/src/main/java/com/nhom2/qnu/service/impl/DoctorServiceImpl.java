package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.AccessDeniedException;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.Department;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.repository.DepartmentRepository;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.UserRepository;
import com.nhom2.qnu.service.DoctorService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorServiceImpl implements DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public DoctorResponse createDoctors(DoctorRequest request) {
        // Tạo object Doctor
        Doctor doctor = new Doctor();

        // Lấy user theo userId
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        doctor.setUser(user);

        // Set chuyên môn
        doctor.setExperience(request.getExperience());

        // Lấy department theo departmentId
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new DataNotFoundException("Department not found"));
        doctor.setDepartment(department);

        // Lưu vào repository
        Doctor newDoctor = doctorRepository.save(doctor);

        // Tạo response
        DoctorResponse response = new DoctorResponse();
        response.setDoctorId(newDoctor.getDoctorId());
        response.setDoctorName(newDoctor.getUser().getFullName());
        response.setExperience(newDoctor.getExperience());
        response.setContactNumber(newDoctor.getUser().getPhoneNumber());
        response.setEmail(newDoctor.getUser().getEmail());

        // Thêm thông tin khoa
        response.setDepartmentName(newDoctor.getDepartment().getName());

        // Thêm danh sách phòng của khoa
        response.setRoomNames(
                newDoctor.getDepartment().getRooms()
                        .stream()
                        .map(Room::getRoomName)
                        .collect(Collectors.toList()));

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
        doctor.setExperience(request.getExperience());

        Doctor updatedDoctor = doctorRepository.save(doctor);

        DoctorResponse doctorResponse = new DoctorResponse();
        doctorResponse.setDoctorId(updatedDoctor.getDoctorId());
        doctorResponse.setDoctorName(updatedDoctor.getUser().getFullName());
        doctorResponse.setExperience(updatedDoctor.getExperience());
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
            response.setExperience(doctor.getExperience());
            response.setContactNumber(doctor.getUser().getPhoneNumber());
            response.setEmail(doctor.getUser().getEmail());

            // Thêm tên khoa
            if (doctor.getDepartment() != null) {
                response.setDepartmentName(doctor.getDepartment().getName());

                // Thêm danh sách tên phòng của khoa
                if (doctor.getDepartment().getRooms() != null) {
                    List<String> roomNames = doctor.getDepartment().getRooms()
                            .stream()
                            .map(r -> r.getRoomName())
                            .collect(Collectors.toList());
                    response.setRoomNames(roomNames);
                }
            }

            doctorResponses.add(response);
        }

        return doctorResponses;
    }

    @Override
    public DoctorResponse findDoctorServiceImpl(String id) {
        Doctor doctor = doctorRepository.findById(id).get();
        DoctorResponse response = new DoctorResponse();
        response.setDoctorId(doctor.getDoctorId());
        response.setDoctorName(doctor.getUser().getFullName());
        response.setExperience(doctor.getExperience());
        response.setContactNumber(doctor.getUser().getPhoneNumber());
        response.setEmail(doctor.getUser().getEmail());
        return response;
    }

    @Override
    public List<DoctorResponse> findByDepartmentId(String departmentId) {
        List<Doctor> doctors = doctorRepository.findByDepartment_DepartmentId(departmentId);

        return doctors.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private DoctorResponse convertToResponse(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();

        response.setDoctorId(doctor.getDoctorId());
        response.setDoctorName(doctor.getUser().getFullName());
        response.setExperience(doctor.getExperience());
        response.setContactNumber(doctor.getUser().getPhoneNumber());
        response.setEmail(doctor.getUser().getEmail());

        if (doctor.getDepartment() != null) {
            response.setDepartmentName(doctor.getDepartment().getName());
            response.setRoomNames(
                    doctor.getDepartment().getRooms()
                            .stream()
                            .map(Room::getRoomName)
                            .collect(Collectors.toList()));
        }

        return response;
    }

}
