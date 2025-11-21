package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.payload.request.AppointmentSchedulesRequest;
import com.nhom2.qnu.payload.response.AppointmentSchedulesResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.payload.response.PatientResponse;
import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    // Định nghĩa các status dùng chung
    private static final String STATUS_WAITING = "Chờ khám";
    private static final String STATUS_FAILED = "Bỏ qua";
    private static final String STATUS_SUCCESS = "Hoàn thành";

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientsRepository patientsRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<AppointmentSchedulesResponse> getAppointmentSchedulesByPatient(String patientId) {

        Patients patients = patientsRepository.findByPatientId(patientId)
                .orElseThrow(() -> new DataNotFoundException("Patients does not exist"));

        List<AppointmentSchedules> appointmentSchedules = appointmentRepository.findAllByPatients(patients);
        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        for (AppointmentSchedules item : appointmentSchedules) {
            responses.add(setupResponse(item));
        }
        return responses;
    }

    @Override
    public List<AppointmentSchedulesResponse> getAppointmentSchedulesByDoctor(String doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));

        List<AppointmentSchedules> appointmentSchedules = appointmentRepository.findAllByDoctor(doctor);
        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        for (AppointmentSchedules item : appointmentSchedules) {
            responses.add(setupResponse(item));
        }
        return responses;
    }

    /**
     * BƯỚC 0 – DS bệnh nhân chờ khám
     * Chỉ trả về các lịch có status = waiting for censorship
     */
    @Override
    public List<AppointmentSchedulesResponse> getAllAppointmentSchedules() {
        // CHỈ lấy các appointment đang ở trạng thái chờ khám
        List<AppointmentSchedules> appointmentSchedules = appointmentRepository.findAllByStatus(STATUS_WAITING);

        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        for (AppointmentSchedules item : appointmentSchedules) {
            responses.add(setupResponse(item));
        }
        return responses;
    }

    @Override
    public AppointmentSchedulesResponse createAppointmentSchedules(AppointmentSchedulesRequest request) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));

        Patients patients = patientsRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("Patient does not exist"));

        // Kiểm tra lịch khám đã tồn tại chưa (trùng giờ với cùng bệnh nhân)
        if (checkAppointmentExists(patients, request.getAppointmentDatetime())) {
            return null;
        }

        // Tạo đối tượng mới
        AppointmentSchedules appointmentSchedules = new AppointmentSchedules();
        appointmentSchedules.setAppointmentDatetime(request.getAppointmentDatetime());
        appointmentSchedules.setDoctor(doctor);
        appointmentSchedules.setPatients(patients);

        // set status mặc định là đang chờ khám
        appointmentSchedules.setStatus(STATUS_WAITING);

        // Set thêm 2 field mới
        appointmentSchedules.setRoom(request.getRoom());
        appointmentSchedules.setNote(request.getNote());

        // Lưu vào DB
        AppointmentSchedules newAppointmentSchedules = appointmentRepository.save(appointmentSchedules);

        return setupResponse(newAppointmentSchedules);
    }

    @Override
    public AppointmentSchedulesResponse updateAppointmentSchedules(
            AppointmentSchedulesRequest request,
            String appointmentSchedulesId) {

        AppointmentSchedules appointmentSchedules = appointmentRepository.findById(appointmentSchedulesId)
                .orElseThrow(() -> new DataNotFoundException("Appointment Schedules does not exist"));

        // Kiểm tra trùng lịch cho bệnh nhân
        if (checkAppointmentExists(appointmentSchedules.getPatients(), request.getAppointmentDatetime())) {
            return null;
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Doctor does not exist"));

        Patients patients = patientsRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("Patient does not exist"));

        appointmentSchedules.setAppointmentDatetime(request.getAppointmentDatetime());
        appointmentSchedules.setDoctor(doctor);
        appointmentSchedules.setPatients(patients);
        appointmentSchedules.setRoom(request.getRoom());
        appointmentSchedules.setNote(request.getNote());

        AppointmentSchedules updateAppointmentSchedules = appointmentRepository.save(appointmentSchedules);

        return setupResponse(updateAppointmentSchedules);
    }

    @Override
    public AppointmentSchedulesResponse updateStatusFailed(String appointmentSchedulesId) {

        AppointmentSchedules appointmentSchedules = appointmentRepository.findById(appointmentSchedulesId)
                .orElseThrow(() -> new DataNotFoundException("Appointment Schedules does not exist"));

        appointmentSchedules.setStatus(STATUS_FAILED);
        AppointmentSchedules updateAppointmentSchedules = appointmentRepository.save(appointmentSchedules);

        return setupResponse(updateAppointmentSchedules);
    }

    @Override
    public AppointmentSchedulesResponse updateStatusSuccessful(String appointmentSchedulesId) {

        AppointmentSchedules appointmentSchedules = appointmentRepository.findById(appointmentSchedulesId)
                .orElseThrow(() -> new DataNotFoundException("Appointment Schedules does not exist"));

        // Optional: nếu muốn check bác sĩ không bị trùng giờ:
        if (checkAppointmentExists(appointmentSchedules.getDoctor(), appointmentSchedules.getAppointmentDatetime())) {
            return null;
        }

        appointmentSchedules.setStatus(STATUS_SUCCESS);
        AppointmentSchedules updateAppointmentSchedules = appointmentRepository.save(appointmentSchedules);

        return setupResponse(updateAppointmentSchedules);
    }

    // ================== HÀM SUPPORT ==================

    public boolean checkAppointmentExists(Patients patient, LocalDateTime appointmentDatetime) {
        return appointmentRepository.existsByPatientsAndAppointmentDatetime(patient, appointmentDatetime);
    }

    public boolean checkAppointmentExists(Doctor doctor, LocalDateTime appointmentDatetime) {
        return appointmentRepository.existsByDoctorAndAppointmentDatetime(doctor, appointmentDatetime);
    }

    public AppointmentSchedulesResponse setupResponse(AppointmentSchedules item) {

        AppointmentSchedulesResponse appointmentSchedulesResponse = new AppointmentSchedulesResponse();
        appointmentSchedulesResponse.setAppointmentScheduleId(item.getAppointmentScheduleId());

        // Patient info
        PatientResponse patientResponse = new PatientResponse();
        patientResponse.setPatientId(item.getPatients().getPatientId());
        patientResponse.setFullName(item.getPatients().getUser().getFullName());
        patientResponse.setDateOfBirth(item.getPatients().getDateOfBirth());
        patientResponse.setContactNumber(item.getPatients().getUser().getPhoneNumber());
        patientResponse.setEmail(item.getPatients().getUser().getEmail());
        patientResponse.setAddress(item.getPatients().getUser().getAddress());
        patientResponse.setOtherInfo(item.getPatients().getOtherInfo());

        appointmentSchedulesResponse.setPatient(patientResponse);

        // Doctor info
        DoctorResponse doctorResponse = new DoctorResponse();
        doctorResponse.setDoctorId(item.getDoctor().getDoctorId());
        doctorResponse.setDoctorName(item.getDoctor().getUser().getFullName());
        doctorResponse.setExperience(item.getDoctor().getExperience());
        doctorResponse.setContactNumber(item.getDoctor().getUser().getPhoneNumber());
        doctorResponse.setEmail(item.getDoctor().getUser().getEmail());

        appointmentSchedulesResponse.setDoctor(doctorResponse);
        appointmentSchedulesResponse.setAppointmentDatetime(item.getAppointmentDatetime());
        appointmentSchedulesResponse.setStatus(item.getStatus());

        return appointmentSchedulesResponse;
    }
}
