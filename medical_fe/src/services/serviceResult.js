import api from "../core/api";
const serviceResultService = {
    create: (formData) => {
        // formData là instance của FormData (chứa tất cả field + file)
        return api.post("/service-results", formData, { headers: { "Content-Type": "multipart/form-data", }, });
    },
}; export default serviceResultService;
