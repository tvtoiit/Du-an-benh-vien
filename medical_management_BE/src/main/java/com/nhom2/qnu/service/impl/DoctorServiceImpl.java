package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.AccessDeniedException;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.Department;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Role;
import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.repository.DepartmentRepository;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.UserRepository;
import com.nhom2.qnu.repository.RoleRepository;
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
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public DoctorResponse createDoctors(DoctorRequest request) {

        // 1) Lấy user theo userId
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        // 2) Check user đã là bác sĩ chưa
        if (doctorRepository.existsByUser(user)) {
            throw new RuntimeException("User này đã được gán làm bác sĩ trước đó!");
        }

        // 3) (OPTIONAL) Update role của account → ROLE_BACSI
        Role doctorRole = roleRepository.findByName("ROLE_BACSI")
                .orElseThrow(() -> new DataNotFoundException("Role not found"));

        user.getAccount().setRole(doctorRole);
        userRepository.save(user); // lưu lại role mới

        // 4) Lấy khoa
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new DataNotFoundException("Department not found"));

        // 5) Tạo Doctor mới
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setExperience(request.getExperience());
        doctor.setDepartment(department);

        Doctor newDoctor = doctorRepository.save(doctor);

        // 6) Build response
        return DoctorResponse.builder()
                .doctorId(newDoctor.getDoctorId())
                .doctorName(user.getFullName())
                .experience(newDoctor.getExperience())
                .contactNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .departmentName(department.getName())
                .roomNames(
                        department.getRooms()
                                .stream()
                                .map(Room::getRoomName)
                                .collect(Collectors.toList()))
                .build();

    }

    @Override
    public DoctorResponse updateDoctors(String id, DoctorRequest request) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Doctor not found"));

        // cập nhật kinh nghiệm
        if (request.getExperience() != null) {
            doctor.setExperience(request.getExperience());
        }

        // nếu đổi khoa
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new DataNotFoundException("Department not found"));

            doctor.setDepartment(department);
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);

        return DoctorResponse.builder()
                .doctorId(updatedDoctor.getDoctorId())
                .experience(updatedDoctor.getExperience())
                .departmentName(updatedDoctor.getDepartment().getName())
                .roomNames(
                        updatedDoctor.getDepartment().getRooms()
                                .stream()
                                .map(Room::getRoomName)
                                .toList())
                .build();
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
