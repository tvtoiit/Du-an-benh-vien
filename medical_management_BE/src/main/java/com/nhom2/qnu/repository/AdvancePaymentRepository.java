package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.AdvancePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdvancePaymentRepository extends JpaRepository<AdvancePayment, String> {
}
