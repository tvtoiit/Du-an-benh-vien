import api from "../core/api";

const roomService = {
    getAll() {
        return api.get("/rooms");
    },

    getByDepartment(departmentId) {
        return api.get(`/rooms/by-department/${departmentId}`);
    },

    create(data) {
        return api.post("/rooms", data);
    },

    update(roomId, data) {
        return api.put(`/rooms/${roomId}`, data);
    },

    delete(roomId) {
        return api.delete(`/rooms/${roomId}`);
    },

    checkDepartmentHasRoom(id) {
        return api.get(`/rooms/department/${id}/exists`);
    }
};

export default roomService;
