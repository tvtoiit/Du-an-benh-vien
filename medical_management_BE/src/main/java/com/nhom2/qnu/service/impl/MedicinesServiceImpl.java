package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.AccessDeniedException;
import com.nhom2.qnu.model.Medicines;
import com.nhom2.qnu.payload.request.MedicinesRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.MedicinesResponse;
import com.nhom2.qnu.repository.MedicinesRepository;
import com.nhom2.qnu.service.MedicinesService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MedicinesServiceImpl implements MedicinesService {

    @Autowired
    private MedicinesRepository medicinesRepository;

    @Override
    public MedicinesResponse updateMedicines(MedicinesRequest request, String id)  {
        if (medicinesRepository.findById(id).isEmpty()) {
            ApiResponse apiResponse = new ApiResponse(Boolean.FALSE, "You can't update medicines!");
            throw new AccessDeniedException(apiResponse);
        }

        Medicines medicines = medicinesRepository.findById(id).get();
        medicines.setName(request.getName());
        medicines.setQuantity(request.getQuantity());
        medicines.setUnit(request.getUnit());
        medicines.setPrice(request.getPrice());

        Medicines newMedicines = medicinesRepository.save(medicines);

        MedicinesResponse medicinesResponse = new MedicinesResponse();
        medicinesResponse.setName(newMedicines.getName());
        medicinesResponse.setQuantity(newMedicines.getQuantity());
        medicinesResponse.setUnit(newMedicines.getUnit());
        medicinesResponse.setPrice(newMedicines.getPrice());
        
        return medicinesResponse;
    }
    
    @Override
    public MedicinesResponse createMedicins(MedicinesRequest request) {
        Medicines medicines = new Medicines();
        medicines.setName(request.getName());
        medicines.setQuantity(request.getQuantity());
        medicines.setUnit(request.getUnit());
        medicines.setPrice(request.getPrice());
        Medicines newMedicines = medicinesRepository.save(medicines);
        MedicinesResponse response = new MedicinesResponse(newMedicines.getMedicineId(),
        newMedicines.getName(), newMedicines.getUnit(), newMedicines.getQuantity(), newMedicines.getPrice());
        return response;
    }

    @Override
    public MedicinesResponse getMedicines(String id) {
        Medicines medicines = medicinesRepository.findById(id).get();
        MedicinesResponse response = new MedicinesResponse();
        response.setMedicineId(medicines.getMedicineId());
        response.setName(medicines.getName());
        response.setUnit(medicines.getUnit());
        response.setQuantity(medicines.getQuantity());
        response.setPrice(medicines.getPrice());
        return response;
    }

    @Override
    public List<MedicinesResponse> getAllMedicines() {
    List<Medicines> medicinesList = medicinesRepository.findAll();
    List<MedicinesResponse> medicinesResponses = new ArrayList<>();
    
    for (Medicines medicines : medicinesList) {
        MedicinesResponse response = new MedicinesResponse();
        response.setMedicineId(medicines.getMedicineId());
        response.setName(medicines.getName());
        response.setUnit(medicines.getUnit());
        response.setQuantity(medicines.getQuantity());
        response.setPrice(medicines.getPrice());
        medicinesResponses.add(response);
    }
        return medicinesResponses;
    }
}
