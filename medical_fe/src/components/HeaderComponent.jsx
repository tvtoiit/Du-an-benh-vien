import React from "react";
import { useNavigate } from "react-router-dom";
// import "../styles/style.css";

export default function Header({ menuItems, activeMenu, setActiveMenu, onRegisterClick }) {
    const navigate = useNavigate();
    const headerButtons = [
        { text: 'HỎI BÁC SĨ BỆNH VIỆN', className: 'btn btn-yellow' },
        { text: 'ĐĂNG KÝ KHÁM', className: 'btn btn-blue', onClick: onRegisterClick },
    ];

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
                    <button onClick={() => navigate("/login")} className="btn notify-btn">
                        Đăng Nhập
                    </button>
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
