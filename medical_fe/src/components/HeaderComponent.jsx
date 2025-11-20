import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginService from ".././services/loginService";
import ".././styles/header.css";

export default function Header({ menuItems, activeMenu, setActiveMenu, onRegisterClick }) {
    const navigate = useNavigate();
    const [checkUser, setCheckUser] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const headerButtons = [
        { text: 'HỎI BÁC SĨ BỆNH VIỆN', className: 'btn btn-yellow' },
        { text: 'ĐĂNG KÝ KHÁM', className: 'btn btn-blue', onClick: onRegisterClick },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        setCheckUser(true);

        // GỌI API LẤY THÔNG TIN USER
        loginService.loginCheckUser(token)
            .then(res => {
                setUserInfo(res);
            })
            .catch(err => {
                console.error("Lỗi load user:", err);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setCheckUser(false);
        setUserInfo(null);
        navigate("/");
    };


    return (
        <>
            <header className="header-container">
                <div className="header-left">
                    <img
                        width="200"
                        src="https://benhvienbinhdinh.com.vn/wp-content/uploads/2021/06/cropped-LogoXanhDuong-326x151.png.webp"
                        alt="Logo"
                    />
                </div>

                <div className="header-actions">
                    {headerButtons.map((btn, idx) => (
                        <button
                            key={idx}
                            className={btn.className}
                            onClick={btn.onClick || null}
                        >
                            {btn.text}
                        </button>
                    ))}

                    <button className="btn invoice-btn">🔍 Tra hóa đơn</button>

                    {/* Nếu chưa login */}
                    {!checkUser && (
                        <button onClick={() => navigate("/login")} className="btn notify-btn">
                            Đăng Nhập
                        </button>
                    )}

                    {checkUser && userInfo && (
                        <div className="user-box">
                            <div className="user-avatar">
                                {userInfo.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name">{userInfo.fullName}</span>

                            <button
                                onClick={() => handleLogout()}
                                className="logout-btn"
                            >
                                Đăng Xuất
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <nav className="header-nav-container">
                <ul className="header-nav-list">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={`nav-item ${activeMenu === item ? 'active' : ''}`}
                            onClick={() => setActiveMenu(item)}
                        >
                            {item.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
