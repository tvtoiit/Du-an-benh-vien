package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.PrescriptionDetail;
import com.nhom2.qnu.model.PrescriptionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionDetailRepository extends JpaRepository<PrescriptionDetail, String> {

    // Lấy toàn bộ thuốc trong 1 đơn
    List<PrescriptionDetail> findByPrescriptionHistory(PrescriptionHistory prescription);

    // Xóa tất cả khi cập nhật đơn thuốc
    void deleteByPrescriptionHistory(PrescriptionHistory prescription);
}
