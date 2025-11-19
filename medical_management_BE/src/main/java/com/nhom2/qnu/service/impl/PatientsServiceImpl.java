package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.AccessDeniedException;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.Services;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.AddServiceForPatientResponse;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.EHealthRecordsResponse;
import com.nhom2.qnu.payload.response.PatientResponse;
import com.nhom2.qnu.payload.response.PatientServiceResponse;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.ServicesRepository;
import com.nhom2.qnu.repository.ServiceResultRepository;
import com.nhom2.qnu.repository.UserRepository;
import com.nhom2.qnu.service.EHealthRecordsService;
import com.nhom2.qnu.service.PatientsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class PatientsServiceImpl implements PatientsService {

  @Autowired
  private PatientsRepository patientsRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ServicesRepository servicesRepository;

  @Autowired
  private ServiceResultRepository serviceResultRepository;

  @Autowired
  private EHealthRecordsService eHealthRecordsService;

  @Override
  public PatientResponse updatePatients(PatientRequest newPatients, String id) {
    Patients patients = patientsRepository.findById(id)
        .orElseThrow(() -> new AccessDeniedException(
            new ApiResponse(Boolean.FALSE, "You can't update patient!")));

    patients.setDateOfBirth(newPatients.getDateOfBirth());
    patients.setOtherInfo(newPatients.getOtherInfo());

    if (patients.getUser() != null) {
      patients.getUser().setFullName(newPatients.getFullName());
      patients.getUser().setPhoneNumber(newPatients.getContactNumber());
      patients.getUser().setAddress(newPatients.getAddress());
      patients.getUser().setEmail(newPatients.getEmail());
    }

    Patients updatedPatient = patientsRepository.save(patients);

    PatientResponse patientResponse = new PatientResponse();
    patientResponse.setPatientId(updatedPatient.getPatientId());

    if (updatedPatient.getUser() != null) {
      patientResponse.setFullName(updatedPatient.getUser().getFullName());
      patientResponse.setAddress(updatedPatient.getUser().getAddress());
      patientResponse.setContactNumber(updatedPatient.getUser().getPhoneNumber());
      patientResponse.setEmail(updatedPatient.getUser().getEmail());
    }

    patientResponse.setDateOfBirth(updatedPatient.getDateOfBirth());
    patientResponse.setOtherInfo(updatedPatient.getOtherInfo());

    return patientResponse;
  }

  @Override
  public List<PatientResponse> findAllPatients() {
    List<Patients> patientsList = patientsRepository.findAll();
    List<PatientResponse> patientResponses = new ArrayList<>();

    for (Patients patient : patientsList) {
      PatientResponse patientResponse = new PatientResponse();
      patientResponse.setPatientId(patient.getPatientId());
      patientResponse.setFullName(patient.getUser().getFullName());
      patientResponse.setAddress(patient.getUser().getAddress());
      patientResponse.setContactNumber(patient.getUser().getPhoneNumber());
      patientResponse.setDateOfBirth(patient.getDateOfBirth());
      patientResponse.setEmail(patient.getUser().getEmail());
      patientResponse.setOtherInfo(patient.getOtherInfo());
      patientResponses.add(patientResponse);
    }
    return patientResponses;
  }

  @Override
  public PatientResponse findByPatients(String id) {
    Patients patient = patientsRepository.findById(id).get();
    PatientResponse patientResponse = new PatientResponse();
    patientResponse.setPatientId(patient.getPatientId());
    patientResponse.setFullName(patient.getUser().getFullName());
    patientResponse.setAddress(patient.getUser().getAddress());
    patientResponse.setContactNumber(patient.getUser().getPhoneNumber());
    patientResponse.setDateOfBirth(patient.getDateOfBirth());
    patientResponse.setEmail(patient.getUser().getEmail());
    patientResponse.setOtherInfo(patient.getOtherInfo());
    return patientResponse;
  }

  @Override
  @Transactional
  public EHealthRecordsResponse createPatients(PatientRequest patientRequest) {
    Patients patients = new Patients();

    if (patientRequest.getUserId() != null) {
      User user = userRepository.findById(patientRequest.getUserId())
          .orElseThrow(() -> new DataNotFoundException("User not found"));
      patients.setUser(user);

      user.setFullName(patientRequest.getFullName());
      user.setPhoneNumber(patientRequest.getContactNumber());
      user.setEmail(patientRequest.getEmail());
      user.setAddress(patientRequest.getAddress());
    }

    patients.setDateOfBirth(patientRequest.getDateOfBirth());
    patients.setOtherInfo(patientRequest.getOtherInfo());

    Patients newPatients = patientsRepository.save(patients);

    return eHealthRecordsService.createEHealthRecord(
        patientRequest, newPatients.getPatientId());
  }

  @Override
  public ResponseEntity<?> addServiceForPatient(String idPatient, String idSerivces) {
    Optional<Services> service = servicesRepository.findById(idSerivces);
    Optional<Patients> patient = patientsRepository.findById(idPatient);

    if (service.isPresent() && patient.isPresent()) {
      patientsRepository.addServiceForPatient(idPatient, idSerivces);
      return new ResponseEntity<>(
          AddServiceForPatientResponse.builder()
              .status("201")
              .massage("Add Success")
              .build(),
          HttpStatus.CREATED);
    }
    return new ResponseEntity<>(
        AddServiceForPatientResponse.builder()
            .status("400")
            .massage("Add Failed")
            .build(),
        HttpStatus.BAD_REQUEST);
  }

  @Override
  public List<PatientServiceResponse> getAllPatientsWithServices() {
    List<Patients> allPatients = patientsRepository.findAll();

    return allPatients.stream()
        .map(p -> {
          // Không có dịch vụ nào thì bỏ qua
          if (p.getServices() == null || p.getServices().isEmpty()) {
            return null;
          }

          // Lọc services: chỉ giữ những dịch vụ CHƯA có ServiceResult.status = "Hoàn
          // thành"
          List<PatientServiceResponse.ServiceResponse> serviceResponses = p.getServices().stream()
              .filter(s -> !serviceResultRepository
                  .existsByPatient_PatientIdAndService_ServiceIdAndStatus(
                      p.getPatientId(),
                      s.getServiceId(),
                      "Hoàn thành" // phải đúng với status khi lưu
          ))
              .map(s -> PatientServiceResponse.ServiceResponse.builder()
                  .patientId(p.getPatientId())
                  .fullName(p.getUser().getFullName())
                  .contactNumber(p.getUser().getPhoneNumber())
                  .email(p.getUser().getEmail())
                  .dateOfBirth(p.getDateOfBirth())
                  .address(p.getUser().getAddress())
                  .otherInfo(p.getOtherInfo())
                  .serviceId(s.getServiceId())
                  .serviceName(s.getServiceName())
                  .build())
              .toList();

          // Nếu bệnh nhân không còn dịch vụ nào "chờ làm" thì bỏ luôn
          if (serviceResponses.isEmpty()) {
            return null;
          }

          return PatientServiceResponse.builder()
              .patientId(p.getPatientId())
              .fullName(p.getUser().getFullName())
              .services(serviceResponses)
              .build();
        })
        .filter(Objects::nonNull)
        .toList();
  }
}
