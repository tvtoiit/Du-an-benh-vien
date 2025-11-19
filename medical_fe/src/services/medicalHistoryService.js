import api from "../core/api";

const medicalHistoryService = {
    create(data) {
        return api.post("/medical-histories", data);
    },
};

export default medicalHistoryService;
