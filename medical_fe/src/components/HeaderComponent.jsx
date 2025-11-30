import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginService from ".././services/loginService";
import ".././styles/header.css";
import logo from "../assets/logo.jpg";

export default function Header({
    activeMenu = "",
    setActiveMenu = () => { },
}) {
    const navigate = useNavigate();
    const [checkUser, setCheckUser] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);

    // MENU CỐ ĐỊNH — KHÔNG ĐƯỢC TRÙNG TÊN VỚI PROP
    const menuList = [
        { label: "Giới thiệu", path: "/gioithieu" },
        { label: "Chuyên khoa", path: "/chuyenkhoa" },
        { label: "Chuyên gia – bác sĩ", path: "/chuyengia" },
        { label: "Dịch vụ đặc biệt", path: "/dichvu" },
        { label: "Tiện nghi", path: "/tiennghi" },
        { label: "Thành tựu", path: "/thanhtuu" },
        { label: "Tin tức", path: "/tintuc" }
    ];

    useEffect(() => {
        const syncUser = () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setCheckUser(false);
                setUserInfo(null);
                return;
            }

            setCheckUser(true);

            loginService.loginCheckUser(token)
                .then(res => setUserInfo(res))
                .catch(() => {
                    setCheckUser(false);
                    setUserInfo(null);
                });
        };

        syncUser();

        window.addEventListener("storage", syncUser);
        return () => window.removeEventListener("storage", syncUser);

    }, [localStorage.getItem("token")]);

    useEffect(() => {
        setOpenMenu(false);
    }, [userInfo]);

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
                        src={logo}
                        alt="Logo"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    />
                </div>

                <div className="header-actions">
                    <div className="hotline-button" onClick={() => window.location.href = "tel:0987970309"}>
                        <span className="phone-icon">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M6.62 10.79a15.093 15.093 0 006.59 6.59l2.2-2.2a1 1 0 011-.24c1.12.37 2.33.57 3.59.57a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 21.01 3 13.94 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.26.2 2.47.57 3.59a1 1 0 01-.24 1.03l-2.2 2.17z"></path>
                            </svg>
                        </span>
                        <span className="phone-number">19000123</span>
                    </div>
                    {userInfo && (
                        <>
                            <button
                                className="btn btn-blue"
                                onClick={() => navigate("/booking")}
                            >
                                Đặt lịch khám
                            </button>
                            <button
                                className="btn btn-blue"
                                onClick={() => navigate("/lichkham")}
                            >
                                Xem lịch khám
                            </button>
                        </>
                    )}


                    <div className="auth-buttons">
                        {!userInfo && (
                            <>
                                <button onClick={() => navigate("/register")} className="btn notify-btn">
                                    Đăng ký
                                </button>
                                <button onClick={() => navigate("/login")} className="btn notify-btn">
                                    Đăng Nhập
                                </button>
                            </>
                        )}
                    </div>

                    {userInfo && (
                        <div className="user-container">
                            <div
                                className="user-info"
                                onClick={() => setOpenMenu(!openMenu)}
                            >
                                <div className="user-avatar">
                                    {userInfo.fullName.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-name">{userInfo.fullName}</span>
                                <span className="dropdown-icon">{openMenu ? "▲" : "▼"}</span>
                            </div>

                            {openMenu && (
                                <div className="dropdown-menu">
                                    <button onClick={handleLogout}>Đăng Xuất</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* MENU THANH NGANG DƯỚI HEADER - TÂM ANH */}
            <div className="main-menu-container">
                <ul className="main-menu-list">
                    {menuList.map((item, index) => (
                        <li
                            key={index}
                            className={`main-menu-item ${activeMenu === item.path ? "active" : ""}`}
                            onClick={() => {
                                setActiveMenu(item.path);

                                const section = document.getElementById(item.path.replace("/", ""));
                                if (section) {
                                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                                } else {
                                    navigate("/"); // nếu chưa ở trang home → quay về home rồi scroll
                                    setTimeout(() => {
                                        const sec = document.getElementById(item.path.replace("/", ""));
                                        sec?.scrollIntoView({ behavior: "smooth" });
                                    }, 300);
                                }
                            }}
                        >
                            {item.label.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
