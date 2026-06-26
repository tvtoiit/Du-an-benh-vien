import React from "react";
import "../styles/footer.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">

                <div className="footer-section">
                    <h3>PHÒNG KHÁM ĐA KHOA HÀ NỘI</h3>
                    <p>Chăm sóc sức khỏe – Tận tâm – Chuyên nghiệp</p>
                </div>

                <div className="footer-section">
                    <h4>Liên Hệ</h4>
                    <p><FaPhoneAlt /> Hotline: 1900 0123</p>
                    <p><FaEnvelope /> Email: phongkhamdakhoahanoi@gmail.com</p>
                    <p><FaMapMarkerAlt /> 112 Tây Sơn, Đống Đa, Hà Nội</p>
                </div>

                <div className="footer-section">
                    <h4>Giờ Làm Việc</h4>
                    <p>Thứ 2 - Thứ 6: 07:00 - 17:00</p>
                    <p>Thứ 7: 07:00 - 11:30</p>
                    <p>Chủ nhật: Nghỉ</p>
                </div>

            </div>

            <div className="footer-bottom">
                © 2026 Phòng khám đa khoa Hà Nội. All rights reserved.
            </div>
        </footer>
    );
}
