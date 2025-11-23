import api from "../core/api";

const departmentService = {
    getAll: () => api.get("/departments"),
    create: (data) => api.post("/departments", data),
    update: (id, data) => api.put(`/departments/${id}`, data),
    delete: (id) => api.delete(`/departments/${id}`)
};

export default departmentService;
