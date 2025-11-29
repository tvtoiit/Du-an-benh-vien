import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import outthenService from "../../../services/outthenService";
import { toast } from "react-toastify";
import "../../../styles/forgotPass.css";

export default function VerifyOtp() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const email = state?.email; // nhận email từ trang quên mật khẩu

    const onSubmit = async (data) => {
        try {
            const res = await outthenService.verifyOtp({
                email: email,
                otp: data.otp,
            });

            navigate("/reset-password", { state: { email, otp: data.otp } });

        } catch (e) {
            const message = e.response?.data?.message || "OTP không đúng!";
            toast.error(message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Nhập mã OTP</h2>

                <p>Email: <strong>{email}</strong></p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Mã OTP</label>

                        <input
                            type="text"
                            {...register("otp", {
                                required: "Vui lòng nhập mã OTP",
                                pattern: {
                                    value: /^[0-9]{6}$/,
                                    message: "OTP phải gồm 6 số"
                                }
                            })}
                            className={errors.otp ? "input-error" : ""}
                        />

                        {errors.otp && (
                            <div className="error-box">
                                <p className="error-text">{errors.otp.message}</p>
                            </div>
                        )}
                    </div>

                    <button className="btn btn-login">Xác minh OTP</button>
                </form>
            </div>
        </div>
    );
}
