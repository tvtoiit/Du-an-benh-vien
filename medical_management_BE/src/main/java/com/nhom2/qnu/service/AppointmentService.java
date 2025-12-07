package com.nhom2.qnu.service;

import com.nhom2.qnu.payload.request.AppointmentRequest;
import com.nhom2.qnu.payload.request.AppointmentSchedulesRequest;
import com.nhom2.qnu.payload.response.AppointmentSchedulesResponse;

import java.util.List;

public interface AppointmentService {

    List<AppointmentSchedulesResponse> getAppointmentSchedulesByPatient(String patientId);

    List<AppointmentSchedulesResponse> getAppointmentSchedulesByDoctor(String doctorId);

    List<AppointmentSchedulesResponse> getAllAppointmentSchedules();

    AppointmentSchedulesResponse createAppointmentSchedules(AppointmentSchedulesRequest request);

    AppointmentSchedulesResponse updateAppointmentSchedules(AppointmentSchedulesRequest request,
            String appointmentSchedulesId);

    AppointmentSchedulesResponse updateStatusFailed(String appointmentSchedulesId);

    AppointmentSchedulesResponse updateStatusSuccessful(String appointmentSchedulesId);

    // API tạo phiếu khám
    Object createAppointment(AppointmentRequest req);

    // >>> API mới: Thêm dịch vụ vào phiếu khám <<<
    Object addServiceForAppointment(String appointmentId, String serviceId);

    void assignServices(String appointmentId, List<String> serviceIds);

}
