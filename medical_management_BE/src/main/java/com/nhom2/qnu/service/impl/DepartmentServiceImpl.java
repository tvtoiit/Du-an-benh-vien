package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.Department;
import com.nhom2.qnu.model.Room;
import com.nhom2.qnu.payload.response.DepartmentResponse;
import com.nhom2.qnu.repository.DepartmentRepository;
import com.nhom2.qnu.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public List<DepartmentResponse> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();

        return departments.stream().map(dep -> {
            DepartmentResponse res = new DepartmentResponse();
            res.setDepartmentId(dep.getDepartmentId());
            res.setName(dep.getName());
            res.setDescription(dep.getDescription());

            // Danh sách phòng
            res.setRoomNames(
                    dep.getRooms().stream()
                            .map(Room::getRoomName)
                            .collect(Collectors.toList()));

            return res;
        }).collect(Collectors.toList());
    }
}
