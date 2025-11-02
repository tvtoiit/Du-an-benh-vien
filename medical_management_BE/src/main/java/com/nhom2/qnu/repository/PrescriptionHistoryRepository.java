package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.PrescriptionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionHistoryRepository extends JpaRepository<PrescriptionHistory, String> {
}
