import api from "../core/api";

const parentService = {
    getAll: () => api.get("/patients/get_All"),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post("/patients", data),
    update: (id, data) => api.put(`/patients/${id}`, data)
};

export default parentService;
