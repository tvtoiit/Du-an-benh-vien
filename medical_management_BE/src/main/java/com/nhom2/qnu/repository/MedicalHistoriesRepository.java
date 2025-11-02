package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.MedicalHistories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalHistoriesRepository extends JpaRepository<MedicalHistories, String> {
}
