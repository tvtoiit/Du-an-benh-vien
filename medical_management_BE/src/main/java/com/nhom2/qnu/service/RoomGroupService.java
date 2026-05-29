package com.nhom2.qnu.service;

import com.nhom2.qnu.model.RoomGroup;

import java.util.List;

public interface RoomGroupService {

    RoomGroup create(RoomGroup request);

    List<RoomGroup> getAll();

    RoomGroup update(String id, RoomGroup request);

    void delete(String id);
}