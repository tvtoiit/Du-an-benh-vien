import React, { useState } from "react";
import "../../../styles/Register.css";
import Header from "../../../components/HeaderComponent";
import Footer from "../../../components/FooterComponent";

export default function Register({ onClose }) {
    const [formData, setFormData] = useState({
        cccd: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu không khớp!");
            return;
        }
        toast.success("Đăng ký thành công!");
        onClose();
    };

    return (
        <div>
            <Header menuItems={menuItems} activeMenu="" setActiveMenu={() => { }} />
            <div className="register-modal">
                <div className="register-container">
                    <button className="close-btn" onClick={onClose}>×</button>
                    <h2>Đăng Ký Khám Bệnh</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>CCCD/CMND</label>
                            <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>

                        <button type="submit" className="btn btn-submit">Đăng Ký</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
