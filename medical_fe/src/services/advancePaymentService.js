// src/services/advancePaymentService.js
import api from "../core/api";

const advancePaymentService = {
    create: (data) => api.post("/advance-payments", data),
};

export default advancePaymentService;
