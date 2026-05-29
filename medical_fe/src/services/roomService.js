import api from "../core/api";

const roomService = {

    // ==========================================
    // GET ALL ROOMS
    // ==========================================
    getAll() {

        return api.get("/rooms");
    },

    // ==========================================
    // GET ROOM BY ROOM GROUP
    // ==========================================
    getByRoomGroup(roomGroupId) {

        return api.get(
            `/rooms/by-room-group/${roomGroupId}`
        );
    },

    // ==========================================
    // CREATE ROOM
    // ==========================================
    create(data) {

        return api.post(
            "/rooms",
            data
        );
    },

    // ==========================================
    // UPDATE ROOM
    // ==========================================
    update(roomId, data) {

        return api.put(
            `/rooms/${roomId}`,
            data
        );
    },

    // ==========================================
    // DELETE ROOM
    // ==========================================
    delete(roomId) {

        return api.delete(
            `/rooms/${roomId}`
        );
    }
};

export default roomService;