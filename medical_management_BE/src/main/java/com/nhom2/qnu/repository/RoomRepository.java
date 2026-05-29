package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

        boolean existsByRoomName(String roomName);

        boolean existsByRoomNameAndRoomIdNot(
                        String roomName,
                        String roomId);

        boolean existsByRoomNameAndRoomGroup_RoomGroupId(
                        String roomName,
                        String roomGroupId);

        boolean existsByRoomNameAndRoomGroup_RoomGroupIdAndRoomIdNot(
                        String roomName,
                        String roomGroupId,
                        String roomId);

        List<Room> findByRoomGroup_RoomGroupId(
                        String roomGroupId);

}
