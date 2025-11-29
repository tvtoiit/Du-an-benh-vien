import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import outthenService from "../../../services/outthenService";
import { toast } from "react-toastify";
import "../../../styles/forgotPass.css";

export default function ResetPassword() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const email = state?.email;
    const otp = state?.otp;

    const onSubmit = async (data) => {
        try {
            await outthenService.resetPassword({
                email,
                otp,
                newPassword: data.newPassword
            });

            toast.success("Đổi mật khẩu thành công!");
            navigate("/login");

        } catch (e) {
            const message = e.response?.data?.message || "Không thể đổi mật khẩu!";
            toast.error(message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Đặt mật khẩu mới</h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Mật khẩu mới */}
                    <div className="form-group">
                        <label>Mật khẩu mới</label>

                        <input
                            type="password"
                            {...register("newPassword", {
                                required: "Vui lòng nhập mật khẩu mới",
                                minLength: {
                                    value: 6,
                                    message: "Mật khẩu phải ít nhất 6 ký tự"
                                }
                            })}
                            className={errors.newPassword ? "input-error" : ""}
                        />

                        {errors.newPassword && (
                            <div className="error-box">
                                <p className="error-text">{errors.newPassword.message}</p>
                            </div>
                        )}
                    </div>

                    <button className="btn btn-login">
                        Đặt mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
}
