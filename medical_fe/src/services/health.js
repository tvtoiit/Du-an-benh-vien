import api from "../core/api";

const health = {
    getById: (id) => api.get(`/e-health-records/${id}`)

};

export default health;
