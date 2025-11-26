import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import outthenService from "../../../services/outthenService";

export default function ForgotPassword() {

    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            await outthenService.forgotPassword({
                email: data.email
            });

            toast.success("OTP đã được gửi đến email!");

            // ⭐ CHUYỂN SANG VERIFY OTP
            navigate("/verify-otp", { state: { email: data.email } });

        } catch (e) {
            toast.error("Email không tồn tại!");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Quên mật khẩu</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Email đăng nhập</label>
                        <input type="email" {...register("email")} />
                    </div>

                    <button className="btn btn-login">Gửi yêu cầu</button>
                </form>
            </div>
        </div>
    );
}
