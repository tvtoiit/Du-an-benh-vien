import React from "react";
import "../../../styles/Register.css";
import { toast } from "react-toastify";
import outthenService from "../../../services/outthenService";

// React Hook Form + Yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

// Schema validate bằng Yup
const schema = yup.object().shape({
    fullName: yup.string().required("Họ và tên không được bỏ trống"),

    phoneNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Số điện thoại phải đủ 10 số")
        .required("Số điện thoại không được bỏ trống"),

    email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Email không được bỏ trống"),

    address: yup.string().required("Địa chỉ không được bỏ trống"),

    password: yup
        .string()
        .min(6, "Mật khẩu phải từ 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Mật khẩu không trùng khớp")
        .required("Vui lòng xác nhận mật khẩu")
});

export default function Register() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();

    // Submit đăng ký
    const onSubmit = async (data) => {

        const requestData = {
            username: data.email,         // Backend lấy username = email
            password: data.password,
            user: {
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                email: data.email,
                address: data.address
            }
        };

        try {
            await outthenService.register(requestData);
            navigate("/login");
        } catch (err) {
            const message = err.response?.data?.message || "Đăng ký thất bại!";
            toast.error(message);
        }

    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Đăng Ký Tài Khoản</h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Họ tên */}
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            {...register("fullName")}
                            className={errors.fullName ? "input-error" : ""}
                        />
                        {errors.fullName && (
                            <div className="error-box">
                                <p className="error-text">{errors.fullName.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Số điện thoại */}
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            {...register("phoneNumber")}
                            className={errors.phoneNumber ? "input-error" : ""}
                        />
                        {errors.phoneNumber && (
                            <div className="error-box">
                                <p className="error-text">{errors.phoneNumber.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="text"
                            {...register("email")}
                            className={errors.email ? "input-error" : ""}
                        />
                        {errors.email && (
                            <div className="error-box">
                                <p className="error-text">{errors.email.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Địa chỉ */}
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input
                            type="text"
                            {...register("address")}
                            className={errors.address ? "input-error" : ""}
                        />
                        {errors.address && (
                            <div className="error-box">
                                <p className="error-text">{errors.address.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Mật khẩu */}
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            {...register("password")}
                            className={errors.password ? "input-error" : ""}
                        />
                        {errors.password && (
                            <div className="error-box">
                                <p className="error-text">{errors.password.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            {...register("confirmPassword")}
                            className={errors.confirmPassword ? "input-error" : ""}
                        />
                        {errors.confirmPassword && (
                            <div className="error-box">
                                <p className="error-text">{errors.confirmPassword.message}</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-submit">
                        Đăng Ký
                    </button>
                    <p className="go-login">
                        Đã có tài khoản? <a href="/login">Đăng nhập</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
