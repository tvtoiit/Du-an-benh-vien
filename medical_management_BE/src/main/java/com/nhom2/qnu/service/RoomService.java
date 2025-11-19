package com.nhom2.qnu.service;

import com.nhom2.qnu.model.Room;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface RoomService {
    public List<Room> getRoomsByDepartment(String departmentId);

}
