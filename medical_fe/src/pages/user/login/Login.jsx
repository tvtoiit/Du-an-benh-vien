import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/Login.css";
import "../../../styles/style.css";
import loginService from "../../../services/loginService";
import { toast } from "react-toastify";

// React Hook Form + Yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schema validate
const schema = yup.object().shape({
    username: yup.string().required("Bạn chưa nhập email / CCCD / SĐT"),
    password: yup.string().required("Bạn chưa nhập mật khẩu")
});

export default function Login() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const res = await loginService.login(data);

            // Nếu BE trả về dạng lỗi ApiResponse
            if (res.success === false) {
                toast.error(res.message || "Đăng nhập thất bại!");
                return;
            }

            // --- THÀNH CÔNG ---
            localStorage.setItem("token", res.accessToken);

            const userlogin = await loginService.loginCheckUser(res.accessToken);

            if (userlogin.doctorId) {
                localStorage.setItem("doctorId", userlogin.doctorId);
            }

            if (userlogin.role === "ROLE_USER" || userlogin.role === "ROLE_BENHNHAN") {
                navigate("/");
            } else {
                navigate("/admin");
            }

        } catch (err) {
            // Nếu BE trả về lỗi dạng Axios response
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Sai tài khoản hoặc mật khẩu!");
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Đăng Nhập Tài Khoản</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Username */}
                    <div className="form-group">
                        <label>Email / CCCD / SĐT</label>
                        <input
                            type="text"
                            placeholder="Nhập Email hoặc SĐT"
                            {...register("username")}
                            className={errors.username ? "input-error" : ""}
                        />

                        {errors.username && (
                            <div className="error-box">
                                <p className="error-text">{errors.username.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            {...register("password")}
                            className={errors.password ? "input-error" : ""}
                        />

                        {errors.password && (
                            <div className="error-box">
                                <p className="error-text">{errors.password.message}</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-login">
                        Đăng Nhập
                    </button>

                    <p className="forgot-password">
                        <Link to="/forgot-password">Quên mật khẩu?</Link>
                    </p>
                    <p className="go-register">
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
