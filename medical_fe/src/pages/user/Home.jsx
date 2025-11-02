import React, { useState } from "react";
import "../../styles/Home.css";
import RegisterModal from "./RegisterModal";

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('Giới thiệu');
  const [showModal, setShowModal] = useState(false);

  const menuItems = [
    'Giới thiệu', 'Chuyên khoa', 'Đội ngũ bác sĩ', 'Cơ sở vật chất',
    'Dịch vụ', 'Tin tức - Sự kiện', 'Dành cho khách hàng', 'Lịch trực - Lịch khám',
    'Tuyển dụng - Đào tạo', 'Đấu thầu mua sắm', 'Thông tin'
  ];

  const headerButtons = [
    { text: 'HỎI BÁC SĨ BỆNH VIỆN', className: 'btn btn-yellow' },
    { text: 'ĐĂNG KÝ KHÁM', className: 'btn btn-blue', onClick: () => setShowModal(true) }, // <-- mở modal
  ];

  return (
    <div className="home-root">
      <div className="container">
        {/* Header Section */}
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

            {/* Tra cứu hóa đơn */}
            <button className="btn invoice-btn">
              🔍 Tra hóa đơn
            </button>

            {/* Thông báo hóa đơn */}
            <button className="btn notify-btn">
              🔔 Thông báo Hóa đơn
            </button>
          </div>
        </header>

        {/* Navigation */}
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

        {/* Hero */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">BỆNH VIỆN BÌNH ĐỊNH</h1>
            <h2 className="hero-subtitle">KHÁM CHỮA BỆNH TOÀN DIỆN</h2>
          </div>
        </section>

        {/* Floating call & chat */}
        <div className="floating-btn floating-btn-left">
          <div className="floating-btn-content">1900 96 96 39</div>
        </div>
        <div className="floating-btn floating-btn-right">
          <div className="floating-btn-content">💬</div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
