package com.nhom2.qnu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhom2.qnu.payload.request.MedicinesRequest;
import com.nhom2.qnu.payload.response.MedicinesResponse;
import com.nhom2.qnu.service.MedicinesService;

@RestController
@RequestMapping("/api/v1/medicines")
public class MedicineController {
    @Autowired
    private MedicinesService medicinesService;
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicines(@RequestBody MedicinesRequest request,
            @PathVariable(value = "id") String id) {
        return new ResponseEntity<>(medicinesService.updateMedicines(request, id), HttpStatus.CREATED);
    }

    @PostMapping("")
    public ResponseEntity<?> createMedicines(@RequestBody MedicinesRequest request) {
      return new ResponseEntity<>(medicinesService.createMedicins(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicines(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok(medicinesService.getMedicines(id));
    } 

    @GetMapping("/get_All")
    public List<MedicinesResponse> getAllPatients() {
        return medicinesService.getAllMedicines();
    }
}
