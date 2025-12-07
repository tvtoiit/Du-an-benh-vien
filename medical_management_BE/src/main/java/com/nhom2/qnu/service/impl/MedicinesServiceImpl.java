package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.AccessDeniedException;
import com.nhom2.qnu.model.Medicines;
import com.nhom2.qnu.payload.request.MedicinesRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.MedicinesResponse;
import com.nhom2.qnu.repository.MedicinesRepository;
import com.nhom2.qnu.repository.PrescriptionDetailRepository;
import com.nhom2.qnu.service.MedicinesService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicinesServiceImpl implements MedicinesService {

        @Autowired
        private MedicinesRepository medicinesRepository;

        @Autowired
        private PrescriptionDetailRepository prescriptionDetailRepository;

        // ============================================
        // CREATE – thêm thuốc mới vào kho
        // ============================================
        @Override
        public MedicinesResponse createMedicins(MedicinesRequest request) {

                // Kiểm tra trùng tên thuốc
                if (medicinesRepository.existsByName(request.getName())) {
                        throw new RuntimeException("Thuốc đã tồn tại trong kho!");
                }

                Medicines med = new Medicines();
                med.setName(request.getName());
                med.setUnit(request.getUnit());
                med.setPrice(request.getPrice());
                med.setQuantity(request.getQuantity()); // tồn kho ban đầu

                Medicines saved = medicinesRepository.save(med);

                return new MedicinesResponse(
                                saved.getMedicineId(),
                                saved.getName(),
                                saved.getUnit(),
                                saved.getQuantity(),
                                saved.getPrice());
        }

        // ============================================
        // UPDATE – nhập thêm thuốc vào kho
        // ============================================
        @Override
        public MedicinesResponse updateMedicines(MedicinesRequest request, String id) {

                Medicines med = medicinesRepository.findById(id)
                                .orElseThrow(() -> new AccessDeniedException(
                                                new ApiResponse(false, "Thuốc không tồn tại!")));

                // cập nhật thông tin thuốc
                med.setName(request.getName());
                med.setUnit(request.getUnit());
                med.setPrice(request.getPrice());

                // Tăng tồn kho → không ghi đè số lượng cũ!
                int newQuantity = med.getQuantity() + request.getQuantity();
                med.setQuantity(newQuantity);

                Medicines saved = medicinesRepository.save(med);

                return new MedicinesResponse(
                                saved.getMedicineId(),
                                saved.getName(),
                                saved.getUnit(),
                                saved.getQuantity(),
                                saved.getPrice());
        }

        // ============================================
        // GET ONE
        // ============================================
        @Override
        public MedicinesResponse getMedicines(String id) {

                Medicines med = medicinesRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc"));

                return new MedicinesResponse(
                                med.getMedicineId(),
                                med.getName(),
                                med.getUnit(),
                                med.getQuantity(),
                                med.getPrice());
        }

        // ============================================
        // GET ALL
        // ============================================
        @Override
        public List<MedicinesResponse> getAllMedicines() {

                return medicinesRepository.findAll().stream()
                                .map(m -> new MedicinesResponse(
                                                m.getMedicineId(),
                                                m.getName(),
                                                m.getUnit(),
                                                m.getQuantity(),
                                                m.getPrice()))
                                .collect(Collectors.toList());
        }

        @Override
        public void deleteMedicine(String id) {

                Medicines medicine = medicinesRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc"));

                // Kiểm tra xem thuốc có đang được sử dụng trong đơn thuốc nào không
                boolean isInUse = prescriptionDetailRepository.existsByMedicine_MedicineId(id);
                if (isInUse) {
                        throw new RuntimeException("Thuốc đang được sử dụng trong đơn thuốc, không thể xóa!");
                }

                medicinesRepository.delete(medicine);
        }

}
