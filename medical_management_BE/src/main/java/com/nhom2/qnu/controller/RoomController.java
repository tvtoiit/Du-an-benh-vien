package com.nhom2.qnu.controller;

import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.service.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // ==========================================
    // CREATE ROOM
    // ==========================================
    @PostMapping
    public ResponseEntity<?> createRoom(
            @RequestBody Room request) {

        return ResponseEntity.ok(
                roomService.create(request));
    }

    // ==========================================
    // UPDATE ROOM
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(
            @PathVariable String id,
            @RequestBody Room room) {

        return ResponseEntity.ok(
                roomService.update(id, room));
    }

    // ==========================================
    // DELETE ROOM
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(
            @PathVariable String id) {

        roomService.delete(id);

        return ResponseEntity.ok("Deleted");
    }

    // ==========================================
    // GET ALL ROOMS
    // ==========================================
    @GetMapping
    public ResponseEntity<?> getAllRooms() {

        return ResponseEntity.ok(
                roomService.getAll());
    }
}