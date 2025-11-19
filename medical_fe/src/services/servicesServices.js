import api from "../core/api";

const serviceService = {
    getAll: () => api.get("/services/get_all"),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post("/patients", data),
    update: (id, data) => api.put(`/patients/${id}`, data)
};

export default serviceService;
