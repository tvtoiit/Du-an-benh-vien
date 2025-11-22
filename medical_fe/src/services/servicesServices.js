import api from "../core/api";

const serviceService = {
    getAll: () => api.get("/services/get_all"),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post("/patients", data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    createDichVu: (data) => api.post("/services/create", data),
    updateDichVu: (id, data) => api.put(`/services/${id}`, data),
};

export default serviceService;
