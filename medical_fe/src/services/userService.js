import api from "../core/api";

const userService = {
    getAll: () => api.get("/user_admin/getAll"),
    getByRole: () => api.get("/user_admin/by-role"),
    getById: (id) => api.get(`/user_admin/${id}`),
    create: (data) => api.post("/user_admin/create", data),
    update: (id, data) => api.put(`/user_admin/${id}`, data),
    delete: (id) => api.delete(`/user_admin/${id}`)
};

export default userService;
