
import api from "../core/api";

const medicinesService = {
    getAll: () => api.get("/medicines/get_All"),
    getById: (id) => api.get(`/medicines/${id}`),
    create: (data) => api.post("/medicines/create", data),
    update: (id, data) => api.put(`/medicines/${id}`, data),
    delete: (id) => api.delete(`/medicines/${id}`)
};

export default medicinesService;
