import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import outthenService from "../../../services/outthenService";
import { toast } from "react-toastify";

export default function VerifyOtp() {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const email = state?.email; // nhận email từ trang quên mật khẩu

    const onSubmit = async (data) => {
        try {
            const res = await outthenService.verifyOtp({
                email: email,
                otp: data.otp,
            });

            toast.success("OTP hợp lệ! Hãy đặt mật khẩu mới");

            // ⭐ Chuyển sang trang reset password
            navigate("/reset-password", { state: { email, otp: data.otp } });

        } catch (e) {
            toast.error("OTP không đúng!");
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
                        <input type="text" {...register("otp")} />
                    </div>

                    <button className="btn btn-login">Xác minh OTP</button>
                </form>
            </div>
        </div>
    );
}
