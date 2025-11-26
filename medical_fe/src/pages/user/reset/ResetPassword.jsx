import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import outthenService from "../../../services/outthenService";
import { toast } from "react-toastify";

export default function ResetPassword() {

    const { state } = useLocation();   // nhận email từ verify-otp
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

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
            toast.error("Không thể đổi mật khẩu!");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Đặt mật khẩu mới</h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input type="password" {...register("newPassword")} />
                    </div>

                    <button className="btn btn-login">
                        Đặt mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
}
