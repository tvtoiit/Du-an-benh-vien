package com.nhom2.qnu.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.PatientRequest;
import com.nhom2.qnu.payload.response.EHealthRecordsResponse;
import com.nhom2.qnu.payload.response.PatientResponse;
import com.nhom2.qnu.payload.response.PatientServiceResponse;
import com.nhom2.qnu.payload.response.PatientWaitingResponse;

public interface PatientsService {

    PatientResponse findByPatients(String id);

    List<PatientResponse> findAllPatients();

    PatientResponse updatePatients(PatientRequest newPatients, String id);

    EHealthRecordsResponse createPatients(PatientRequest patientRequest);

    /**
     * Danh sách bệnh nhân + dịch vụ (dùng cho cận lâm sàng, nếu bạn còn dùng flow
     * này).
     * Lưu ý: implement nên lấy dịch vụ qua Appointment/AppointmentService,
     * KHÔNG lấy qua ManyToMany Patients–Services nữa.
     */
    List<PatientServiceResponse> getAllPatientsWithServices();

    /**
     * Lấy danh sách user có role "USER" – để phê duyệt thành bệnh nhân.
     */
    List<User> getPatientsNotAccepted();

    /**
     * Lấy thông tin bệnh nhân theo userId (dùng cho app bệnh nhân).
     */
    Object getPatientByUserId(String userId);

    /**
     * Danh sách bệnh nhân đang chờ tiếp nhận.
     */
    List<PatientWaitingResponse> getWaitingPatients();
}
