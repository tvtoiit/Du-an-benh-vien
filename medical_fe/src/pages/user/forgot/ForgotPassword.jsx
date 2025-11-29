import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import outthenService from "../../../services/outthenService";

import "../../../styles/forgotPass.css";

export default function ForgotPassword() {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    // const onSubmit = async (data) => {
    //     try {
    //         await outthenService.forgotPassword({
    //             email: data.email
    //         });

    //         toast.success("OTP đã được gửi đến email!");
    //         navigate("/verify-otp", { state: { email: data.email } });

    //     } catch (e) {
    //         toast.error("Email không tồn tại!");
    //     }
    // };

    const onSubmit = async (data) => {
        try {
            const res = await outthenService.forgotPassword({
                email: data.email
            });

            toast.success(res.message);
            navigate("/verify-otp", { state: { email: data.email } });

        } catch (e) {
            const message = e.response?.data?.message;
            toast.error(message);
        }
    };


    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Quên mật khẩu</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Email đăng nhập</label>

                        <input
                            type="text"
                            {...register("email", {
                                required: "Vui lòng nhập email",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Email không đúng định dạng"
                                }
                            })}
                        />

                        {/* HIỂN THỊ LỖI */}
                        {errors.email && (
                            <div className="error-box">
                                <p className="error-text">{errors.email.message}</p>
                            </div>
                        )}
                    </div>

                    <button className="btn btn-login" type="submit">
                        Gửi yêu cầu
                    </button>
                </form>
            </div>
        </div>
    );
}
