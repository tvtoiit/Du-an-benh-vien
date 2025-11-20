// src/services/paymentService.js
import api from "../core/api";

const paymentService = {
    // Danh sách bệnh nhân chờ thanh toán
    getWaitingList: () => api.get("/payment-details/waiting"),

    // Summary cho 1 bệnh nhân (PaymentSummaryResponse)
    getSummary: (patientId, prescriptionId) =>
        api.get("/payment-details/summary", {
            params: { patientId, prescriptionId },
        }),

    // Tạo bản ghi PaymentDetails (xác nhận thanh toán)
    createPaymentDetails: (data) => api.post("/payment-details", data),
};

export default paymentService;
