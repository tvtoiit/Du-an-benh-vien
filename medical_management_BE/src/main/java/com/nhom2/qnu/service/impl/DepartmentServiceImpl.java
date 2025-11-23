package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.model.Department;
import com.nhom2.qnu.repository.DepartmentRepository;
import com.nhom2.qnu.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    private DepartmentRepository repo;

    @Override
    public List<Department> getAll() {
        return repo.findAll();
    }

    @Override
    public Department create(Department department) {
        if (repo.existsByName(department.getName())) {
            throw new RuntimeException("Khoa đã tồn tại");
        }
        return repo.save(department);
    }

    @Override
    public Department update(String id, Department updated) {
        Department existing = repo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Khoa không tồn tại"));

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());

        return repo.save(existing);
    }

    @Override
    public void delete(String id) {
        repo.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Khoa không tồn tại"));
        repo.deleteById(id);
    }
}
