import api from "../core/api";

const appointmentService = {
    create: (data) => api.post("/appointment-schedules", data),
    getAll: () => api.get("/appointment-schedules"),
    getByPatient: (patientId) => api.get(`/appointment-schedules/patient/${patientId}`),
    getByDoctor: (doctorId) => api.get(`/appointment-schedules/doctor/${doctorId}`)
};

export default appointmentService;
