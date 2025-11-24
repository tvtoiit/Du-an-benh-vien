import api from "../core/api";

const roleService = {
    getAllRole: () => api.get("/role")
};

export default roleService;
