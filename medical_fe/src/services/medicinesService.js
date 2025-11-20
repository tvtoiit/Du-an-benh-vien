// src/services/medicinesService.js
import api from "../core/api";

// MedicineController.java:
// @RequestMapping("/api/v1/medicines")
// POST   /create           -> tạo thuốc
// GET    /{id}             -> lấy 1 thuốc theo id
// GET    /get_All          -> lấy tất cả thuốc

const medicinesService = {
    // Lấy tất cả thuốc (dùng cho KeDonForm)
    getAll: () => api.get("/medicines/get_All"),

    // (tuỳ nhu cầu, sau này dùng thêm)
    getById: (id) => api.get(`/medicines/${id}`),
    create: (data) => api.post("/medicines/create", data),
    update: (id, data) => api.put(`/medicines/${id}`, data),
};

export default medicinesService;
