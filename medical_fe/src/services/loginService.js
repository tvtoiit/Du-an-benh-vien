import api from "../core/api";

const loginService = {
    login: (data) => api.post("/auth/signin", data),
    loginCheckUser: (accessToken, data) => api.get(`/user_admin/${accessToken}`, data),
};

export default loginService;
