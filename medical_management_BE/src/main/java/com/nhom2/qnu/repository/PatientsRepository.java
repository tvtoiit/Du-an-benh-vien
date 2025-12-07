package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientsRepository extends JpaRepository<Patients, String> {

    Optional<Patients> findByPatientId(String id);

    List<Patients> findAllByUser_UserId(String userId);

    /**
     * Lấy danh sách User có role = USER
     * (dùng cho màn phê duyệt tạo bệnh nhân từ user thường).
     */
    @Query("""
            SELECT u FROM User u
            JOIN u.account acc
            JOIN acc.role r
            WHERE r.roleId = 'USER'
            """)
    List<User> findUsersWithUserRole();

    /**
     * Bệnh nhân đang "active" cho tiếp nhận:
     * - Chưa từng có lịch khám nào
     * HOẶC
     * - Có lịch khám mới nhất nhưng chưa "Đã thanh toán"
     */
    @Query("""
                SELECT p
                FROM Patients p
                WHERE
                    NOT EXISTS (
                        SELECT a1
                        FROM AppointmentSchedules a1
                        WHERE a1.patients = p
                    )
                    OR EXISTS (
                        SELECT a2
                        FROM AppointmentSchedules a2
                        WHERE a2.patients = p
                          AND a2.appointmentDatetime = (
                                SELECT MAX(a3.appointmentDatetime)
                                FROM AppointmentSchedules a3
                                WHERE a3.patients = p
                          )
                          AND a2.status IN ('Đã thanh toán', 'Chờ khám')
                    )
            """)
    List<Patients> findActivePatients();

    /**
     * Lấy tất cả bệnh nhân (basic) – dùng khi không cần fetch thêm quan hệ.
     */
    @Query("SELECT p FROM Patients p")
    List<Patients> findAllPatientsBasic();
}
