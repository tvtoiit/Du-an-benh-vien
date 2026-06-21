package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.AccessDeniedException;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.AppointmentServiceItem;
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
import java.util.stream.Collectors;

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
          .cccd(p.getUser().getCcCongDan())
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

    List<AppointmentSchedules> appointments = appointmentRepository.findAllByStatus("Chờ CLS");

    List<PatientServiceResponse> result = new ArrayList<>();

    for (AppointmentSchedules app : appointments) {

      for (AppointmentServiceItem item : app.getAppointmentServices()) {

        boolean done = serviceResultRepository
            .existsByAppointmentSchedule_AppointmentScheduleIdAndService_ServiceId(
                app.getAppointmentScheduleId(),
                item.getService().getServiceId());

        if (done) {
          continue;
        }

        result.add(
            PatientServiceResponse.builder()
                .appointmentId(
                    app.getAppointmentScheduleId())

                .patientId(
                    app.getPatients().getPatientId())

                .fullName(
                    app.getPatients()
                        .getUser()
                        .getFullName())

                .cccd(
                    app.getPatients()
                        .getUser()
                        .getCcCongDan())

                .phoneNumber(
                    app.getPatients()
                        .getUser()
                        .getPhoneNumber())

                .dateOfBirth(
                    app.getPatients()
                        .getUser()
                        .getDateOfBirth())

                .serviceId(
                    item.getService()
                        .getServiceId())

                .serviceName(
                    item.getService()
                        .getServiceName())

                .build());
      }
    }

    return result;
  }

  @Override
  public List<PatientWaitingResponse> getWaitingPatients() {

    // List<Patients> list = patientsRepository.findActivePatients();
    List<Patients> list = patientsRepository.findAll();
    List<PatientWaitingResponse> responses = new ArrayList<>();

    for (Patients p : list) {

      AppointmentSchedules latest = appointmentRepository
          .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(p.getPatientId())
          .orElse(null);

      System.out.println(
          p.getUser().getFullName()
              + " -> "
              + (latest != null
                  ? latest.getStatus()
                  : "NULL"));

      String status;
      LocalDateTime appointmentTime = null;
      String room = null;
      String appointmentId = null;

      if (latest == null) {

        status = "Chờ tiếp nhận";

      } else if ("Đã kê đơn".equalsIgnoreCase(latest.getStatus())
          || "Hoàn thành".equalsIgnoreCase(latest.getStatus())) {

        status = "Khám lại";

      } else {

        status = "Đang xử lý";
      }

      responses.add(
          PatientWaitingResponse.builder()
              .patientId(p.getPatientId())
              .fullName(p.getUser().getFullName())
              .lastAppointmentStatus(
                  latest != null
                      ? latest.getStatus()
                      : null)
              .lastVisitDate(
                  latest != null
                      ? latest.getAppointmentDatetime()
                      : null)
              .cccd(p.getUser().getCcCongDan())
              .note(p.getOtherInfo())
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
