import api from "../core/api";

const doctorService = {
    getAll: () => api.get("/doctors/get_All"),
    getById: (id) => api.get(`/doctors/${id}`),
    create: (data) => api.post("/doctors", data),
    update: (id, data) => api.put(`/doctors/${id}`, data),
    delete: (id) => api.delete(`/doctors/${id}`),
    getByIdDepartment: (idDepartment) => api.get(`/doctors/by-department/${idDepartment}`),
    getByIdRoom: (idRoom) => api.get(`/doctors/by-room/${idRoom}`)

};

export default doctorService;
