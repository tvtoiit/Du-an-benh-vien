package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.repository.RoomRepository;
import com.nhom2.qnu.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public List<Room> getRoomsByDepartment(String departmentId) {
        return roomRepository.findByDepartment_DepartmentId(departmentId);
    }
}
