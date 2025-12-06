import api from "../core/api";

const serviceResultService = {
    // Lấy danh sách bệnh nhân đã có kết quả cận lâm sàng
    // BE: GET /api/v1/service-results/patients-with-results?doctorId=xxx
    getPatientsWithResults: (doctorId) =>
        api.get("/service-results/patients-with-results", {
            params: { doctorId },
        }),

    // Lấy danh sách bệnh nhân đã có kết quả cận lâm sàng
    // BE: GET /api/v1/service-results/patients-with-results?doctorId=xxx
    getPatientsWithResultsKeDon: (doctorId) =>
        api.get("/service-results/patients-with-results-kedon", {
            params: { doctorId },
        }),

    // Lấy danh sách kết quả cận lâm sàng của 1 bệnh nhân
    // BE: GET /api/v1/service-results/patient/{patientId}
    getByPatient: (patientId) =>
        api.get(`/service-results/patient/${patientId}`),
};

export default serviceResultService;
