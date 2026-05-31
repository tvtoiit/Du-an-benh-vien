package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;

import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Role;
import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.model.User;

import com.nhom2.qnu.payload.request.DoctorRequest;
import com.nhom2.qnu.payload.response.DoctorResponse;

import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.RoleRepository;
import com.nhom2.qnu.repository.RoomRepository;
import com.nhom2.qnu.repository.UserRepository;

import com.nhom2.qnu.service.DoctorService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl
                implements DoctorService {

        private final DoctorRepository doctorRepository;

        private final UserRepository userRepository;

        private final RoleRepository roleRepository;

        private final RoomRepository roomRepository;

        // =====================================================
        // CREATE DOCTOR
        // =====================================================
        @Override
        public DoctorResponse createDoctors(
                        DoctorRequest request) {

                // tìm user
                User user = userRepository.findById(
                                request.getUserId())
                                .orElseThrow(() -> new DataNotFoundException(
                                                "User not found"));

                // check đã là doctor chưa
                if (doctorRepository
                                .existsByUser(user)) {

                        throw new RuntimeException(
                                        "User đã là bác sĩ!");
                }

                // tìm room
                Room room = roomRepository.findById(
                                request.getRoomId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Không tìm thấy phòng!"));

                // set role bác sĩ
                Role doctorRole = roleRepository
                                .findByName("ROLE_BACSI")
                                .orElseThrow(() -> new DataNotFoundException(
                                                "Role not found"));

                user.getAccount()
                                .setRole(doctorRole);

                userRepository.save(user);

                // tạo doctor
                Doctor doctor = new Doctor();

                doctor.setUser(user);

                doctor.setDegree(
                                request.getDegree());

                doctor.setConsultationFee(
                                request.getConsultationFee());

                doctor.setRoom(room);

                Doctor savedDoctor = doctorRepository.save(doctor);

                return convertToResponse(
                                savedDoctor);
        }

        // =====================================================
        // UPDATE DOCTOR
        // =====================================================
        @Override
        public DoctorResponse updateDoctors(
                        String id,
                        DoctorRequest request) {

                Doctor doctor = doctorRepository.findById(id)
                                .orElseThrow(() -> new DataNotFoundException(
                                                "Doctor not found"));

                // update degree
                if (request.getDegree() != null) {

                        doctor.setDegree(
                                        request.getDegree());
                }

                // update fee
                if (request.getConsultationFee() != null) {

                        doctor.setConsultationFee(
                                        request.getConsultationFee());
                }

                // update room
                if (request.getRoomId() != null) {

                        Room room = roomRepository.findById(
                                        request.getRoomId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Không tìm thấy phòng!"));

                        doctor.setRoom(room);
                }

                Doctor updatedDoctor = doctorRepository.save(doctor);

                return convertToResponse(
                                updatedDoctor);
        }

        // =====================================================
        // GET ALL
        // =====================================================
        @Override
        public List<DoctorResponse> findAllDoctors() {

                return doctorRepository.findAll()
                                .stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        // =====================================================
        // GET ONE
        // =====================================================
        @Override
        public DoctorResponse findDoctorServiceImpl(
                        String id) {

                Doctor doctor = doctorRepository.findById(id)
                                .orElseThrow(() -> new DataNotFoundException(
                                                "Doctor not found"));

                return convertToResponse(
                                doctor);
        }

        // =====================================================
        // CONVERT RESPONSE
        // =====================================================
        private DoctorResponse convertToResponse(
                        Doctor doctor) {

                DoctorResponse response = new DoctorResponse();

                response.setDoctorId(
                                doctor.getDoctorId());

                response.setDoctorName(
                                doctor.getUser()
                                                .getFullName());

                response.setDegree(
                                doctor.getDegree());

                response.setConsultationFee(
                                doctor.getConsultationFee());

                response.setContactNumber(
                                doctor.getUser()
                                                .getPhoneNumber());

                response.setEmail(
                                doctor.getUser()
                                                .getEmail());

                response.setCccd(
                                doctor.getUser()
                                                .getCcCongDan());

                // ROOM
                if (doctor.getRoom() != null) {

                        response.setRoomName(
                                        doctor.getRoom()
                                                        .getRoomName());

                        if (doctor.getRoom()
                                        .getRoomGroup() != null) {

                                response.setRoomGroupName(
                                                doctor.getRoom()
                                                                .getRoomGroup()
                                                                .getGroupName());
                        }
                }

                return response;
        }

        @Override
        public List<DoctorResponse> getDoctorsByRoomGroup(
                        String roomGroupId) {

                List<Doctor> doctors = doctorRepository
                                .findByRoom_RoomGroup_RoomGroupId(
                                                roomGroupId);

                return doctors.stream()
                                .map(this::convertToResponse)
                                .toList();
        }
}