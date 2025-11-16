package com.nhom2.qnu.service;

import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;

public interface PaymentDetailsService {
    /**
     * Tạo hoặc cập nhật payment details (tạo mới luôn cho đơn giản).
     * Tính total_amount = sum(service prices for patient) + sum(medicine prices for prescription)
     */
    PaymentDetails createPaymentDetails(PaymentDetailsRequest req);

    /**
     * Nếu muốn update một payment details đã có (ví dụ sửa total sau khi thay đổi), thêm method này
     */
    PaymentDetails updatePaymentDetails(String paymentDetailId, PaymentDetailsRequest req);
}
