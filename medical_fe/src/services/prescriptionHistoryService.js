import api from "../core/api";

const prescriptionHistoryService = {
    // tạo 1 dòng thuốc trong toa
    create: (data) => api.post("/prescription_history/create", data),

    // nếu sau này cần sửa, xoá thì bổ sung
    update: (id, data) => api.put(`/prescription-history/${id}`, data),
};
export default prescriptionHistoryService;
