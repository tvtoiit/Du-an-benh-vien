package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.Department;
import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.repository.DepartmentRepository;
import com.nhom2.qnu.repository.RoomRepository;
import com.nhom2.qnu.service.RoomService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public Room create(Room request) {

        // 1. Check khoa có tồn tại
        Department department = departmentRepository.findById(request.getDepartment().getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Khoa không tồn tại!"));

        // 2. Check trùng tên phòng trong khoa
        if (roomRepository.existsByRoomNameAndDepartment_DepartmentId(
                request.getRoomName(), department.getDepartmentId())) {
            throw new RuntimeException("Tên phòng đã tồn tại trong khoa!");
        }

        // 3. Tạo mới
        Room room = new Room();
        room.setRoomId(UUID.randomUUID().toString());
        room.setRoomName(request.getRoomName());
        room.setDepartment(department);

        return roomRepository.save(room);
    }

    @Override
    public Room update(String roomId, Room request) {

        // 1. Tìm phòng cần update
        Room existing = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 2. Lấy khoa hiện tại của phòng
        String departmentId = existing.getDepartment().getDepartmentId();

        // 3. Check trùng tên trong khoa (bỏ qua chính nó)
        if (roomRepository.existsByRoomNameAndDepartment_DepartmentIdAndRoomIdNot(
                request.getRoomName(),
                departmentId,
                roomId)) {
            throw new RuntimeException("Tên phòng đã tồn tại trong khoa!");
        }

        // 4. Cập nhật
        existing.setRoomName(request.getRoomName());

        return roomRepository.save(existing);
    }

    @Override
    public void delete(String roomId) {
        roomRepository.deleteById(roomId);
    }

    @Override
    public List<Room> getAll() {
        return roomRepository.findAll();
    }

    @Override
    public List<Room> getRoomsByDepartment(String departmentId) {
        return roomRepository.findByDepartment_DepartmentId(departmentId);
    }
}
