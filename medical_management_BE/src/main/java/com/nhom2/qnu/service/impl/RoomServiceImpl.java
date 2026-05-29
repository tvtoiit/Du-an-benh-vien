package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.model.RoomGroup;

import com.nhom2.qnu.repository.RoomRepository;
import com.nhom2.qnu.repository.RoomGroupRepository;

import com.nhom2.qnu.service.RoomService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl
        implements RoomService {

    private final RoomRepository roomRepository;

    private final RoomGroupRepository roomGroupRepository;

    // ==========================================
    // CREATE ROOM
    // ==========================================
    @Override
    public Room create(Room request) {

        // check room group
        RoomGroup roomGroup = roomGroupRepository
                .findById(
                        request
                                .getRoomGroup()
                                .getRoomGroupId())
                .orElseThrow(() -> new RuntimeException(
                        "Khu phòng không tồn tại!"));

        // check trùng phòng trong cùng khu
        boolean exists = roomRepository
                .existsByRoomNameAndRoomGroup_RoomGroupId(

                        request.getRoomName(),

                        roomGroup.getRoomGroupId());

        if (exists) {

            throw new RuntimeException(
                    "Phòng đã tồn tại trong khu này!");
        }

        Room room = new Room();

        room.setRoomId(
                UUID.randomUUID().toString());

        room.setRoomName(
                request.getRoomName());

        room.setStatus(
                request.getStatus());

        room.setRoomGroup(
                roomGroup);

        return roomRepository.save(room);
    }

    // ==========================================
    // UPDATE ROOM
    // ==========================================
    @Override
    public Room update(
            String roomId,
            Room request) {

        Room existing = roomRepository
                .findById(roomId)
                .orElseThrow(() -> new RuntimeException(
                        "Room not found"));

        // check room group
        RoomGroup roomGroup = roomGroupRepository
                .findById(
                        request
                                .getRoomGroup()
                                .getRoomGroupId())
                .orElseThrow(() -> new RuntimeException(
                        "Khu phòng không tồn tại!"));

        // check trùng
        boolean exists = roomRepository
                .existsByRoomNameAndRoomGroup_RoomGroupIdAndRoomIdNot(

                        request.getRoomName(),

                        roomGroup.getRoomGroupId(),

                        roomId);

        if (exists) {

            throw new RuntimeException(
                    "Phòng đã tồn tại trong khu này!");
        }

        existing.setRoomName(
                request.getRoomName());

        existing.setStatus(
                request.getStatus());

        existing.setRoomGroup(
                roomGroup);

        return roomRepository.save(existing);
    }

    // ==========================================
    // DELETE ROOM
    // ==========================================
    @Override
    public void delete(String roomId) {

        roomRepository.deleteById(
                roomId);
    }

    // ==========================================
    // GET ALL
    // ==========================================
    @Override
    public List<Room> getAll() {

        return roomRepository.findAll();
    }
}