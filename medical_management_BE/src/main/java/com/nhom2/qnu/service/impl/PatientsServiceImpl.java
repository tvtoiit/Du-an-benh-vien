package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.AccessDeniedException;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.Role;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.EHealthRecordsResponse;
import com.nhom2.qnu.payload.response.PatientResponse;
import com.nhom2.qnu.payload.response.PatientServiceResponse;
import com.nhom2.qnu.payload.response.PatientWaitingResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.RoleRepository;
import com.nhom2.qnu.repository.ServiceResultRepository;
import com.nhom2.qnu.repository.UserRepository;
import com.nhom2.qnu.service.EHealthRecordsService;
import com.nhom2.qnu.service.PatientsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PatientsServiceImpl implements PatientsService {

  @Autowired
  private PatientsRepository patientsRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private RoleRepository roleRepository;

  @Autowired
  private ServiceResultRepository serviceResultRepository;

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private EHealthRecordsService eHealthRecordsService;

  // ================================
  // LẤY USER CHƯA ĐƯỢC CHUYỂN THÀNH BỆNH NHÂN
  // ================================
  @Override
  public List<User> getPatientsNotAccepted() {
    return patientsRepository.findUsersWithUserRole();
  }

  // ================================
  // CẬP NHẬT THÔNG TIN BỆNH NHÂN
  // ================================
  @Override
  public PatientResponse updatePatients(PatientRequest newPatients, String id) {

    Patients patients = patientsRepository.findById(id)
        .orElseThrow(() -> new AccessDeniedException(
            new ApiResponse(false, "You can't update patient!")));

    // patients.setDateOfBirth(newPatients.getDateOfBirth());
    patients.setOtherInfo(newPatients.getOtherInfo());

    Patients updatedPatient = patientsRepository.save(patients);

    return PatientResponse.builder()
        .patientId(updatedPatient.getPatientId())
        .fullName(updatedPatient.getUser().getFullName())
        .address(updatedPatient.getUser().getAddress())
        .contactNumber(updatedPatient.getUser().getPhoneNumber())
        .email(updatedPatient.getUser().getEmail())
        .dateOfBirth(updatedPatient.getUser().getDateOfBirth())
        .otherInfo(updatedPatient.getOtherInfo())
        .build();
  }

  // ================================
  // LẤY TOÀN BỘ DANH SÁCH BỆNH NHÂN
  // ================================
  @Override
  public List<PatientResponse> findAllPatients() {

    List<Patients> patientsList = patientsRepository.findAll();
    List<PatientResponse> responses = new ArrayList<>();

    for (Patients p : patientsList) {
      responses.add(PatientResponse.builder()
          .patientId(p.getPatientId())
          .fullName(p.getUser().getFullName())
          .address(p.getUser().getAddress())
          .contactNumber(p.getUser().getPhoneNumber())
          .email(p.getUser().getEmail())
          .dateOfBirth(p.getUser().getDateOfBirth())
          .otherInfo(p.getOtherInfo())
          .build());
    }

    return responses;
  }

  // ================================
  // LẤY BỆNH NHÂN THEO ID
  // ================================
  @Override
  public PatientResponse findByPatients(String id) {

    Patients p = patientsRepository.findById(id)
        .orElseThrow(() -> new DataNotFoundException("Patient not found"));

    return PatientResponse.builder()
        .patientId(p.getPatientId())
        .fullName(p.getUser().getFullName())
        .address(p.getUser().getAddress())
        .contactNumber(p.getUser().getPhoneNumber())
        .email(p.getUser().getEmail())
        .dateOfBirth(p.getUser().getDateOfBirth())
        .otherInfo(p.getOtherInfo())
        .build();
  }

  // ================================
  // TẠO BỆNH NHÂN + HỒ SƠ SỨC KHỎE
  // ================================
  @Override
  @Transactional
  public EHealthRecordsResponse createPatients(PatientRequest req) {

    Patients p = new Patients();

    // Gán user cho bệnh nhân
    if (req.getUserId() != null) {

      User user = userRepository.findById(req.getUserId())
          .orElseThrow(() -> new DataNotFoundException("User not found"));

      p.setUser(user);

      Role role = roleRepository.findById("BENHNHAN")
          .orElseThrow(() -> new DataNotFoundException("Role BENHNHAN not found"));

      user.getAccount().setRole(role);
      userRepository.save(user);
    }

    // p.setDateOfBirth(req.getDateOfBirth());
    p.setOtherInfo(req.getOtherInfo());

    Patients newPatient = patientsRepository.save(p);

    return eHealthRecordsService.createEHealthRecord(
        req,
        newPatient.getPatientId());
  }

  // ================================
  // LẤY BỆNH NHÂN THEO USERID
  // ================================
  @Override
  public Object getPatientByUserId(String userId) {

    List<Patients> list = patientsRepository.findAllByUser_UserId(userId);

    if (list.isEmpty()) {
      return new ApiResponse("Không tìm thấy bệnh nhân!", HttpStatus.NOT_FOUND);
    }

    Patients p = list.get(0);

    return PatientResponse.builder()
        .patientId(p.getPatientId())
        .fullName(p.getUser().getFullName())
        .address(p.getUser().getAddress())
        .contactNumber(p.getUser().getPhoneNumber())
        .email(p.getUser().getEmail())
        .dateOfBirth(p.getUser().getDateOfBirth())
        .otherInfo(p.getOtherInfo())
        .build();
  }

  // ================================
  // LẤY DANH SÁCH BỆNH NHÂN + DỊCH VỤ THEO PHIẾU KHÁM
  // ================================
  @Override
  public List<PatientServiceResponse> getAllPatientsWithServices() {

    // chỉ lấy các lịch đang "Chờ khám"
    List<AppointmentSchedules> appointments = appointmentRepository.findAllByStatus("Chỉ định CLS");

    return appointments.stream().map(app -> {

      // dịch vụ trong phiếu khám
      var serviceResponses = app.getAppointmentServices().stream()
          .map(as -> PatientServiceResponse.ServiceResponse.builder()
              .patientId(app.getPatients().getPatientId())
              .fullName(app.getPatients().getUser().getFullName())
              .serviceId(as.getService().getServiceId())
              .serviceName(as.getService().getServiceName())
              .build())
          .toList();

      return PatientServiceResponse.builder()
          .patientId(app.getPatients().getPatientId())
          .fullName(app.getPatients().getUser().getFullName())
          .services(serviceResponses)
          .build();

    }).toList();
  }

  @Override
  public List<PatientWaitingResponse> getWaitingPatients() {

    List<Patients> list = patientsRepository.findActivePatients();
    List<PatientWaitingResponse> responses = new ArrayList<>();

    for (Patients p : list) {

      AppointmentSchedules latest = appointmentRepository
          .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(p.getPatientId())
          .orElse(null);

      String status;
      LocalDateTime appointmentTime = null;
      String room = null;
      String appointmentId = null;

      // Chưa có lịch khám nào → Chờ tiếp nhận
      if (latest == null) {
        status = "Chờ tiếp nhận";
      }
      // Đã thanh toán → phải hiển thị để khám lại
      else if ("Đã thanh toán".equalsIgnoreCase(latest.getStatus())) {
        status = "Khám lại";
      }
      // Chờ khám → hiển thị
      else if ("Chờ khám".equalsIgnoreCase(latest.getStatus())) {
        status = "Chờ khám";
        appointmentTime = latest.getAppointmentDatetime();
        appointmentId = latest.getAppointmentScheduleId();
        room = latest.getRoom();
      }
      // Các trạng thái khác → không hiển thị
      else {
        continue;
      }

      responses.add(
          PatientWaitingResponse.builder()
              .patientId(p.getPatientId())
              .fullName(p.getUser().getFullName())
              .cccd(p.getOtherInfo())
              .phone(p.getUser().getPhoneNumber())
              .appointmentTime(appointmentTime)
              .status(status)
              .note(p.getOtherInfo())
              .room(room)
              .appointmentId(appointmentId)
              .build());
    }

    return responses;
  }

}
