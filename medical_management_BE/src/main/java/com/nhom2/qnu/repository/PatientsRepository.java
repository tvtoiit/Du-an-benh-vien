package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.response.ServiceUsageReportResponse;

import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatientsRepository extends JpaRepository<Patients, String> {
    Optional<Patients> findByPatientId(String id);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO medical_management.tbl_patient_service (patient_id, service_id) VALUES (:idPatient,:idSerivces)", nativeQuery = true)
    void addServiceForPatient(@Param("idPatient") String idPatient,
            @Param("idSerivces") String idSerivces);

    @Query("SELECT DISTINCT p FROM Patients p JOIN FETCH p.services")
    List<Patients> findAllWithServices();

    // @Query("""
    // SELECT p FROM Patients p
    // WHERE NOT EXISTS (
    // SELECT a FROM AppointmentSchedules a
    // )
    // """)
    // List<Patients> findPatientsNotAccepted();s

    @Query("""
                SELECT u FROM User u
                JOIN u.account acc
                JOIN acc.role r
                WHERE r.roleId = 'USER'
            """)
    List<User> findUsersWithUserRole();
}
