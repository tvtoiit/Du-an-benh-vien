import React, { useState } from "react";
import "../../styles/Home.css";
import Login from "../user/login/Login";
import Header from "../../components/HeaderComponent";
import Footer from "../../components/FooterComponent";


export default function Home() {
  const [activeMenu, setActiveMenu] = useState('Giới thiệu');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const menuItems = [
    'Giới thiệu', 'Chuyên khoa', 'Đội ngũ bác sĩ', 'Cơ sở vật chất',
    'Dịch vụ', 'Tin tức - Sự kiện', 'Dành cho khách hàng', 'Lịch trực - Lịch khám',
    'Tuyển dụng - Đào tạo', 'Đấu thầu mua sắm', 'Thông tin'
  ];

  return (
    <div className="home-root">
      <div className="container">
        {/* Header */}
        <Header
          menuItems={menuItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onRegisterClick={() => setShowRegisterModal(true)}
        />

        {/* Hero Section */}
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

        {/* Footer */}
        <Footer />
      </div>

      {/* Modals */}
      {/* {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />} */}
      {showLoginModal && <Login onLoginClick={() => setShowLoginModal(false)} onRegisterClick={() => setShowRegisterModal(true)} />}
    </div>
  );
}
