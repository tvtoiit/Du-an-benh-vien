package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.RoomGroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomGroupRepository
        extends JpaRepository<RoomGroup, String> {

    boolean existsByGroupName(String groupName);
}