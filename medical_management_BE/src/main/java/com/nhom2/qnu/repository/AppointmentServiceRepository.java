package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.AppointmentSchedules;
import com.nhom2.qnu.model.AppointmentServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentServiceRepository extends JpaRepository<AppointmentServiceItem, String> {

    List<AppointmentServiceItem> findByAppointment(AppointmentSchedules appointment);

    List<AppointmentServiceItem> findByAppointment_AppointmentScheduleId(String appointmentId);
}
