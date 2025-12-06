package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.AppointmentService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentServiceRepository extends JpaRepository<AppointmentService, String> {

    // lấy tất cả dịch vụ của 1 lần khám
    List<AppointmentService> findByAppointment(AppointmentSchedules appointment);

    // hoặc theo id
    List<AppointmentService> findByAppointment_AppointmentScheduleId(String appointmentId);
}
