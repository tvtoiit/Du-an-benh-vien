import api from "../core/api";

const outthenService = {

    // Đăng ký tài khoản
    register: (data) => api.post("/auth/signupuser", data),

    // Gửi mail quên mật khẩu
    forgotPassword: (data) =>
        api.post("/auth/forgot-password", data),

    // Đổi mật khẩu từ link
    resetPassword: (data) =>
        api.post("/auth/reset-password", data),

    verifyOtp: (data) => api.post("/auth/verify-otp", data),

};

export default outthenService;
