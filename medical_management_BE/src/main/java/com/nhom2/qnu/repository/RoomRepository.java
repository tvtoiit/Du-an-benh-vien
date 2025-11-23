package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    List<Room> findByDepartment_DepartmentId(String departmentId);

    boolean existsByDepartment_DepartmentId(String departmentId);

    boolean existsByRoomName(String roomName);

    boolean existsByRoomNameAndDepartment_DepartmentId(String roomName, String departmentId);

    boolean existsByRoomNameAndDepartment_DepartmentIdAndRoomIdNot(
            String roomName,
            String departmentId,
            String roomId);

}
