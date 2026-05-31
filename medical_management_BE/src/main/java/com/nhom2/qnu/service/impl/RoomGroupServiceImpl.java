package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.RoomGroup;
import com.nhom2.qnu.repository.RoomGroupRepository;
import com.nhom2.qnu.service.RoomGroupService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomGroupServiceImpl
                implements RoomGroupService {

        private final RoomGroupRepository roomGroupRepository;

        @Override
        public RoomGroup create(
                        RoomGroup request) {

                // check trùng tên
                if (roomGroupRepository
                                .existsByGroupName(
                                                request.getGroupName())) {

                        throw new RuntimeException(
                                        "Khu phòng đã tồn tại!");
                }

                RoomGroup roomGroup = new RoomGroup();

                roomGroup.setRoomGroupId(
                                UUID.randomUUID().toString());

                roomGroup.setGroupName(
                                request.getGroupName());

                return roomGroupRepository
                                .save(roomGroup);
        }

        @Override
        public List<RoomGroup> getAll() {
                return roomGroupRepository.findAll();
        }

        @Override
        public RoomGroup update(
                        String id,
                        RoomGroup request) {

                RoomGroup existing = roomGroupRepository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Không tìm thấy khu phòng!"));

                existing.setGroupName(
                                request.getGroupName());

                return roomGroupRepository
                                .save(existing);
        }

        @Override
        public void delete(String id) {

                roomGroupRepository
                                .deleteById(id);
        }
}