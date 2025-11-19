import api from "../core/api";

const departmentService = {
    getAll: () => api.get("/departments")
};

export default departmentService;
