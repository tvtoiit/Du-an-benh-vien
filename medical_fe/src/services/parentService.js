import api from "../core/api";

const parentService = {
    getAll: () => api.get("/patients/get_All"),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post("/patients", data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    addServicesForPatient: (patientId, serviceIds) =>
        api.post(`/appointments/patients/${patientId}/services`, {
            serviceIds: serviceIds
        }),
    getPatientsWithServices: () => api.get("/patients/services"),
    getWaitingPatients: () => api.get("/patients/not-accepted"),
    getPatientByUserId: (id) => api.get(`/patients/by-user/${id}`),
    getWaitingPatients1: () => api.get("/patients/waiting"),

};

export default parentService;
