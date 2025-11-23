package com.nhom2.qnu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.repository.RoomRepository;
import com.nhom2.qnu.service.RoomService;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room request) {
        return ResponseEntity.ok(roomService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable String id, @RequestBody Room room) {
        return ResponseEntity.ok(roomService.update(id, room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable String id) {
        roomService.delete(id);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping
    public ResponseEntity<?> getAllRooms() {
        return ResponseEntity.ok(roomService.getAll());
    }

    @GetMapping("/by-department/{departmentId}")
    public ResponseEntity<?> getRoomsByDepartment(@PathVariable String departmentId) {
        return ResponseEntity.ok(roomService.getRoomsByDepartment(departmentId));
    }

    @GetMapping("/department/{id}/exists")
    public ResponseEntity<Boolean> checkHasRoom(@PathVariable String id) {
        boolean exists = roomRepository.existsByDepartment_DepartmentId(id);
        return ResponseEntity.ok(exists);
    }
}
