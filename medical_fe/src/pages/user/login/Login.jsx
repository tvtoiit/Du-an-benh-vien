import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/HeaderComponent";
import Footer from "../../../components/FooterComponent";
import "../../../styles/Login.css";
import "../../../styles/style.css";
import loginService from "../../../services/loginService";

export default function Login() {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await loginService.login(formData);
            localStorage.setItem("token", res.accessToken);

            // Kiểm tra vài trò của người dùng
            // Get api user / admin
            const userlogin = await loginService.loginCheckUser(res.accessToken);
            if (userlogin.role === "ROLE_USER") {
                navigate("/");
            } else {
                navigate("/admin");
            }
        } catch (err) {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    const menuItems = [
        "Giới thiệu", "Chuyên khoa", "Đội ngũ bác sĩ", "Cơ sở vật chất",
        "Dịch vụ", "Tin tức - Sự kiện", "Dành cho khách hàng", "Lịch trực - Lịch khám",
        "Tuyển dụng - Đào tạo", "Đấu thầu mua sắm", "Thông tin"
    ];

    return (
        <div>
            <Header menuItems={menuItems} activeMenu="" setActiveMenu={() => { }} />

            <div className="login-page">
                <div className="login-card">
                    <h2>Đăng Nhập Bệnh Viện</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email / CCCD / SĐT</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Nhập Email hoặc SĐT"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-login">Đăng Nhập</button>

                        <p className="go-register">
                            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
