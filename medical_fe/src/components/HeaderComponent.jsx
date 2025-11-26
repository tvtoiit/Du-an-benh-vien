import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginService from ".././services/loginService";
import ".././styles/header.css";

export default function Header({
    menuItems = [],
    activeMenu = "",
    setActiveMenu = () => { },
    onRegisterClick = null
}) {
    const navigate = useNavigate();
    const [checkUser, setCheckUser] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);

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
                        src="https://benhvienbinhdinh.com.vn/wp-content/uploads/2021/06/cropped-LogoXanhDuong-326x151.png.webp"
                        alt="Logo"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    />
                </div>

                <div className="header-actions">
                    {/* Chỉ hiện nút Đăng ký khám nếu onRegisterClick được truyền */}
                    {userInfo && (
                        <button
                            className="btn btn-blue"
                            onClick={() => navigate("/booking")}
                        >
                            Đặt lịch khám
                        </button>
                    )}

                    {!userInfo && (
                        <button onClick={() => navigate("/login")} className="btn notify-btn">
                            Đăng Nhập
                        </button>
                    )}

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

            {/* Chỉ hiển thị menu nếu menuItems.length > 0 */}
            {menuItems.length > 0 && (
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
            )}
        </>
    );
}
