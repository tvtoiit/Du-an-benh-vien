package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.AppointmentServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentServiceItemRepository extends JpaRepository<AppointmentServiceItem, String> {

}
