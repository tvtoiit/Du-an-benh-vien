package com.nhom2.qnu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom2.qnu.service.RoleServices;

@RestController(value = "role")
@RequestMapping("/api/v1/role")
public class RoleController {
    @Autowired
    private RoleServices roleServices;

    @GetMapping()
    public ResponseEntity<?> roleGetAll() {
        return new ResponseEntity<>(roleServices.getRoles(), HttpStatus.OK);
    }
}
