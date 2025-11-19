package com.nhom2.qnu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import com.nhom2.qnu.service.RoomService;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/room")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @GetMapping("/department/{id}")
    public ResponseEntity<?> getRooms(@PathVariable String id) {
        return ResponseEntity.ok(roomService.getRoomsByDepartment(id));
    }
}
