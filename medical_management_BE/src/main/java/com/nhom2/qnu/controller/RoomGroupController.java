package com.nhom2.qnu.controller;

import com.nhom2.qnu.model.RoomGroup;
import com.nhom2.qnu.service.RoomGroupService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/room-groups")
@RequiredArgsConstructor
public class RoomGroupController {

        private final RoomGroupService roomGroupService;

        // CREATE
        @PostMapping
        public ResponseEntity<?> create(
                        @RequestBody RoomGroup request) {

                return ResponseEntity.ok(
                                roomGroupService.create(request));
        }

        // GET ALL
        @GetMapping
        public ResponseEntity<?> getAll() {

                return ResponseEntity.ok(
                                roomGroupService.getAll());
        }

        // UPDATE
        @PutMapping("/{id}")
        public ResponseEntity<?> update(
                        @PathVariable String id,
                        @RequestBody RoomGroup request) {

                return ResponseEntity.ok(
                                roomGroupService.update(id, request));
        }

        // DELETE
        @DeleteMapping("/{id}")
        public ResponseEntity<?> delete(
                        @PathVariable String id) {

                roomGroupService.delete(id);

                return ResponseEntity.ok(
                                "Deleted successfully");
        }
}