import api from "../core/api";

const roomGroupService = {

    // lấy tất cả nhóm phòng
    getAll() {

        return api.get("/room-groups");
    },

    // tạo nhóm phòng
    create(data) {

        return api.post(
            "/room-groups",
            data
        );
    },

    // update nhóm phòng
    update(id, data) {

        return api.put(
            `/ room - groups / ${id} `,
            data
        );
    },

    // xóa nhóm phòng
    delete(id) {

        return api.delete(
            `/ room - groups / ${id} `
        );
    }
};

export default roomGroupService;