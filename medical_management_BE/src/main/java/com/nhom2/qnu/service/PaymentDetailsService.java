package com.nhom2.qnu.service;

import com.nhom2.qnu.model.PaymentDetails;
import com.nhom2.qnu.payload.response.PaymentSummaryResponse;
import com.nhom2.qnu.payload.request.PaymentDetailsRequest;
import com.nhom2.qnu.payload.response.PaymentSummaryResponse;
import com.sun.xml.bind.v2.schemagen.xmlschema.List;

public interface PaymentDetailsService {
    PaymentDetails createPaymentDetails(PaymentDetailsRequest req);

    PaymentDetails updatePaymentDetails(String paymentDetailId, PaymentDetailsRequest req);

    // ✅ danh sách bệnh nhân chờ thanh toán
    List<PaymentSummaryResponse> getWaitingPayments();

    // ✅ summary cho 1 bệnh nhân (PaymentForm)
    PaymentSummaryResponse getPaymentSummary(String patientId, String prescriptionId);
}
