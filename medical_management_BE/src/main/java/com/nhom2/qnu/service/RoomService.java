package com.nhom2.qnu.service;

import com.nhom2.qnu.model.Room;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface RoomService {
    List<Room> getRoomsByDepartment(String departmentId);

    Room create(Room room);

    Room update(String roomId, Room room);

    void delete(String roomId);

    List<Room> getAll();

}
