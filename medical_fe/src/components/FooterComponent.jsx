import React from "react";
import "../styles/footer.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">

                <div className="footer-section">
                    <h3>Bệnh Viện Bình Định</h3>
                    <p>Chăm sóc sức khỏe – Tận tâm – Chuyên nghiệp</p>
                </div>

                <div className="footer-section">
                    <h4>Liên Hệ</h4>
                    <p><FaPhoneAlt /> Hotline: 1900 0123</p>
                    <p><FaEnvelope /> Email: contact@bvbinhdinh.vn</p>
                    <p><FaMapMarkerAlt /> 01 Nguyễn Huệ, TP. Quy Nhơn, Bình Định</p>
                </div>

                <div className="footer-section">
                    <h4>Giờ Làm Việc</h4>
                    <p>Thứ 2 - Thứ 6: 07:00 - 17:00</p>
                    <p>Thứ 7: 07:00 - 11:30</p>
                    <p>Chủ nhật: Nghỉ</p>
                </div>

            </div>

            <div className="footer-bottom">
                © 2025 Bệnh viện Bình Định. All rights reserved.
            </div>
        </footer>
    );
}
