// src/services/advancePaymentService.js
import api from "../core/api";

const advancePaymentService = {
    create: (data) => api.post("/advance-payments", data),
    getWaitingPatients: () => api.get("/payments/advance/waiting"),
    getPatients: () => api.get("/advance-payments/patients"),
};

export default advancePaymentService;
