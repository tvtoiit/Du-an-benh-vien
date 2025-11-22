import api from "../core/api";

const medicalHistoryService = {
    create(data) {
        return api.post("/medical-histories", data);
    },
    createResult(data) {
        return api.post("/medical-histories/conclude", data);
    },
};

export default medicalHistoryService;
