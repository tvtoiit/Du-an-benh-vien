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

    // ==========================================
    // CREATE ROOM
    // ==========================================
    @Override
    public Room create(Room request) {

        // check trùng tên phòng
        if (roomRepository.existsByRoomName(
                request.getRoomName())) {

            throw new RuntimeException(
                    "Tên phòng đã tồn tại!");
        }

        Room room = new Room();
        room.setRoomName(request.getRoomName());

        return roomRepository.save(room);
    }

    // ==========================================
    // UPDATE ROOM
    // ==========================================
    @Override
    public Room update(String roomId, Room request) {

        Room existing = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException(
                        "Room not found"));

        // check trùng tên
        boolean exists = roomRepository
                .existsByRoomNameAndRoomIdNot(
                        request.getRoomName(),
                        roomId);

        if (exists) {
            throw new RuntimeException(
                    "Tên phòng đã tồn tại!");
        }

        existing.setRoomName(request.getRoomName());

        return roomRepository.save(existing);
    }

    // ==========================================
    // DELETE ROOM
    // ==========================================
    @Override
    public void delete(String roomId) {

        roomRepository.deleteById(roomId);
    }

    // ==========================================
    // GET ALL
    // ==========================================
    @Override
    public List<Room> getAll() {

        return roomRepository.findAll();
    }
}