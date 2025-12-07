package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.enums.AppointmentStatus;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.Services;
import com.nhom2.qnu.model.AppointmentServiceItem;

import com.nhom2.qnu.payload.request.AppointmentRequest;
import com.nhom2.qnu.payload.request.AppointmentSchedulesRequest;
import com.nhom2.qnu.payload.response.AppointmentSchedulesResponse;
import com.nhom2.qnu.payload.response.DoctorResponse;
import com.nhom2.qnu.payload.response.PatientResponse;

import com.nhom2.qnu.repository.AppointmentRepository;
import com.nhom2.qnu.repository.AppointmentServiceItemRepository;
import com.nhom2.qnu.repository.PatientsRepository;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.ServicesRepository;

import com.nhom2.qnu.service.AppointmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private static final String STATUS_WAITING = "Chờ khám";
    private static final String STATUS_FAILED = "Bỏ qua";
    private static final String STATUS_SUCCESS = "Hoàn thành";

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientsRepository patientsRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ServicesRepository servicesRepository;

    @Autowired
    private AppointmentServiceItemRepository appointmentServiceItemRepository;

    // =======================================================
    // GET APPOINTMENTS THEO BỆNH NHÂN
    // =======================================================
    @Override
    public List<AppointmentSchedulesResponse> getAppointmentSchedulesByPatient(String patientId) {

        Patients patients = patientsRepository.findByPatientId(patientId)
                .orElseThrow(() -> new DataNotFoundException("Patients not found"));

        List<AppointmentSchedules> list = appointmentRepository.findAllByPatients(patients);

        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        list.forEach(item -> responses.add(setupResponse(item)));

        return responses;
    }

    // =======================================================
    // GET APPOINTMENTS THEO DOCTOR
    // =======================================================
    @Override
    public List<AppointmentSchedulesResponse> getAppointmentSchedulesByDoctor(String doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DataNotFoundException("Doctor not found"));

        List<AppointmentSchedules> list = appointmentRepository.findAllByDoctor(doctor);

        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        list.forEach(item -> responses.add(setupResponse(item)));

        return responses;
    }

    // =======================================================
    // DANH SÁCH BỆNH NHÂN CHỜ KHÁM
    // =======================================================
    @Override
    public List<AppointmentSchedulesResponse> getAllAppointmentSchedules() {

        List<AppointmentSchedules> list = appointmentRepository.findAllByStatus(STATUS_WAITING);

        List<AppointmentSchedulesResponse> responses = new ArrayList<>();
        list.forEach(item -> responses.add(setupResponse(item)));

        return responses;
    }

    // =======================================================
    // TẠO LỊCH HẸN
    // =======================================================
    @Override
    public AppointmentSchedulesResponse createAppointmentSchedules(AppointmentSchedulesRequest request) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Doctor not found"));

        Patients patients = patientsRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("Patient not found"));

        if (checkAppointmentExists(patients, request.getAppointmentDatetime())) {
            return null;
        }

        AppointmentSchedules app = new AppointmentSchedules();
        app.setAppointmentDatetime(request.getAppointmentDatetime());
        app.setDoctor(doctor);
        app.setPatients(patients);
        app.setRoom(request.getRoom());
        app.setNote(request.getNote());
        app.setStatus(STATUS_WAITING);

        return setupResponse(appointmentRepository.save(app));
    }

    // =======================================================
    // UPDATE LỊCH HẸN
    // =======================================================
    @Override
    public AppointmentSchedulesResponse updateAppointmentSchedules(
            AppointmentSchedulesRequest request,
            String appointmentSchedulesId) {

        AppointmentSchedules app = appointmentRepository.findById(appointmentSchedulesId)
                .orElseThrow(() -> new DataNotFoundException("Appointment not found"));

        if (checkAppointmentExists(app.getPatients(), request.getAppointmentDatetime())) {
            return null;
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Doctor not found"));

        Patients patients = patientsRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("Patient not found"));

        app.setAppointmentDatetime(request.getAppointmentDatetime());
        app.setDoctor(doctor);
        app.setPatients(patients);
        app.setRoom(request.getRoom());
        app.setNote(request.getNote());

        return setupResponse(appointmentRepository.save(app));
    }

    // =======================================================
    // UPDATE STATUS – FAILED
    // =======================================================
    @Override
    public AppointmentSchedulesResponse updateStatusFailed(String id) {

        AppointmentSchedules app = appointmentRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Appointment not found"));

        app.setStatus(STATUS_FAILED);

        return setupResponse(appointmentRepository.save(app));
    }

    // =======================================================
    // UPDATE STATUS – SUCCESS
    // =======================================================
    @Override
    public AppointmentSchedulesResponse updateStatusSuccessful(String id) {

        AppointmentSchedules app = appointmentRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Appointment not found"));

        if (checkAppointmentExists(app.getDoctor(), app.getAppointmentDatetime())) {
            return null;
        }

        app.setStatus(STATUS_SUCCESS);

        return setupResponse(appointmentRepository.save(app));
    }

    // =======================================================
    // API: TẠO PHIẾU KHÁM
    // =======================================================
    @Override
    @Transactional
    public Object createAppointment(AppointmentRequest req) {

        Patients patient = patientsRepository.findById(req.getPatientId())
                .orElseThrow(() -> new DataNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new DataNotFoundException("Doctor not found"));

        AppointmentSchedules newApp = new AppointmentSchedules();
        newApp.setPatients(patient);
        newApp.setDoctor(doctor);
        newApp.setAppointmentDatetime(req.getDatetime());
        newApp.setStatus(STATUS_WAITING);
        newApp.setRoom(req.getRoom());
        newApp.setNote(req.getNote());

        return setupResponse(appointmentRepository.save(newApp));
    }

    // =======================================================
    // ⭐ API MỚI: THÊM DỊCH VỤ VÀO PHIẾU KHÁM
    // =======================================================
    @Override
    @Transactional
    public Object addServiceForAppointment(String appointmentId, String serviceId) {

        AppointmentSchedules app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new DataNotFoundException("Appointment not found"));

        Services service = servicesRepository.findById(serviceId)
                .orElseThrow(() -> new DataNotFoundException("Service not found"));

        boolean exists = app.getAppointmentServices().stream()
                .anyMatch(x -> x.getService().getServiceId().equals(serviceId));

        if (exists) {
            return "Dịch vụ đã tồn tại trong phiếu khám";
        }

        // ⭐ SỬA CHÍNH TẠI ĐÂY – DÙNG ENTITY MỚI
        AppointmentServiceItem item = new AppointmentServiceItem();
        item.setAppointment(app);
        item.setService(service);

        app.getAppointmentServices().add(item);
        appointmentRepository.save(app);

        return "Thêm dịch vụ thành công";
    }

    // =======================================================
    // HÀM HỖ TRỢ
    // =======================================================
    public boolean checkAppointmentExists(Patients patient, LocalDateTime time) {
        return appointmentRepository.existsByPatientsAndAppointmentDatetime(patient, time);
    }

    public boolean checkAppointmentExists(Doctor doctor, LocalDateTime time) {
        return appointmentRepository.existsByDoctorAndAppointmentDatetime(doctor, time);
    }

    public AppointmentSchedulesResponse setupResponse(AppointmentSchedules item) {

        AppointmentSchedulesResponse res = new AppointmentSchedulesResponse();
        res.setAppointmentScheduleId(item.getAppointmentScheduleId());
        res.setAppointmentDatetime(item.getAppointmentDatetime());
        res.setStatus(item.getStatus());

        PatientResponse p = new PatientResponse();
        p.setPatientId(item.getPatients().getPatientId());
        p.setFullName(item.getPatients().getUser().getFullName());
        p.setAddress(item.getPatients().getUser().getAddress());
        p.setEmail(item.getPatients().getUser().getEmail());
        p.setContactNumber(item.getPatients().getUser().getPhoneNumber());
        p.setDateOfBirth(item.getPatients().getDateOfBirth());
        p.setOtherInfo(item.getPatients().getOtherInfo());
        res.setPatient(p);

        DoctorResponse d = new DoctorResponse();
        d.setDoctorId(item.getDoctor().getDoctorId());
        d.setDoctorName(item.getDoctor().getUser().getFullName());
        d.setExperience(item.getDoctor().getExperience());
        d.setEmail(item.getDoctor().getUser().getEmail());
        d.setContactNumber(item.getDoctor().getUser().getPhoneNumber());
        res.setDoctor(d);

        return res;
    }

    @Override
    public void assignServices(String patientId, List<String> serviceIds) {

        // 1. Lấy lần khám mới nhất
        AppointmentSchedules appt = appointmentRepository
                .findTopByPatients_PatientIdOrderByAppointmentDatetimeDesc(patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lần khám gần nhất"));

        // 2. Nếu có chỉ định dịch vụ → chuyển trạng thái
        if (serviceIds != null && !serviceIds.isEmpty()) {
            appt.setStatus("Chỉ định CLS");
            appointmentRepository.save(appt);
        }

        // 3. Gắn từng dịch vụ vào lần khám
        for (String sid : serviceIds) {
            Services service = servicesRepository.findById(sid)
                    .orElseThrow(() -> new RuntimeException("Service not found: " + sid));

            AppointmentServiceItem item = new AppointmentServiceItem();
            item.setAppointment(appt);
            item.setService(service);

            appointmentServiceItemRepository.save(item);
        }
    }

}
