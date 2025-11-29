import React, { useState } from "react";
import "../../../styles/tracuu.css";
import loginService from "../../../services/loginService";
import patientService from "../../../services/parentService";
import healthService from "../../../services/health";
import { toast } from "react-toastify";
import { FaUser, FaStethoscope, FaHeartbeat, FaCalendarCheck } from "react-icons/fa";

export default function TraCuu() {

    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState(null);
    const [healthRecord, setHealthRecord] = useState(null);

    const handleSearch = async () => {
        setLoading(true);

        try {
            // 1. Token
            const token = localStorage.getItem("token");
            if (!token) return toast.error("Bạn chưa đăng nhập!");

            // 2. Lấy user từ token
            const userRes = await loginService.loginCheckUser(token);
            const userId = userRes?.userId;
            if (!userId) return toast.error("Không tìm thấy thông tin tài khoản!");

            // 3. Lấy thông tin bệnh nhân
            const patientRes = await patientService.getPatientByUserId(userId);

            if (!patientRes || !patientRes.patientId) {
                toast.error("Không tìm thấy bệnh nhân!");
                setLoading(false);
                return;
            }

            setPatient(patientRes);

            // 4. Lấy hồ sơ bệnh án
            const healthRes = await healthService.getById(patientRes.patientId);
            setHealthRecord(healthRes);

        } catch (err) {
            toast.error("Không thể tra cứu!");
            console.log(err);
        }

        setLoading(false);
    };

    return (
        <div className="tracuu-pro">
            <div className="pro-card">

                <h2 className="title">
                    <FaStethoscope className="title-icon" /> Tra Cứu Hồ Sơ Bệnh Án
                </h2>
                <p className="subtitle">Xem thông tin bệnh nhân & lịch sử khám bệnh</p>

                <div className="search-box">
                    <button onClick={handleSearch} className="btn-search">
                        {loading ? "Đang xử lý..." : "Tra cứu ngay"}
                    </button>
                </div>

                {/* =========================== */}
                {/*        THÔNG TIN BỆNH NHÂN */}
                {/* =========================== */}
                {patient && (
                    <div className="info-section">
                        <h3 className="section-title">
                            <FaUser /> Thông Tin Bệnh Nhân
                        </h3>

                        <div className="info-grid">
                            <div className="info-item"><strong>Họ tên:</strong> {patient.fullName}</div>
                            <div className="info-item"><strong>Điện thoại:</strong> {patient.contactNumber}</div>
                            <div className="info-item"><strong>Email:</strong> {patient.email}</div>
                            <div className="info-item"><strong>Ngày sinh:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                            <div className="info-item"><strong>Địa chỉ:</strong> {patient.address}</div>
                            <div className="info-item"><strong>Thông tin khác:</strong> {patient.otherInfo || "Không có"}</div>
                        </div>
                    </div>
                )}

                {/* =========================== */}
                {/*        HỒ SƠ BỆNH ÁN        */}
                {/* =========================== */}
                {healthRecord && (
                    <div className="info-section">
                        <h3 className="section-title">
                            <FaHeartbeat /> Hồ Sơ Bệnh Án
                        </h3>

                        <div className="info-grid">
                            <div className="info-item"><strong>Mã hồ sơ:</strong> {healthRecord.recordId}</div>
                            <div className="info-item"><strong>Ghi chú:</strong> {healthRecord.otherInfo || "Không có"}</div>
                        </div>

                        {/* Lịch sử dùng thuốc */}
                        <div className="subbox">
                            <h4>Lịch sử dùng thuốc</h4>
                            {healthRecord.medicinesHistories?.length ? (
                                <ul>
                                    {healthRecord.medicinesHistories.map((m, i) => (
                                        <li key={i}>{m.medicineName} – SL: {m.quantity}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty">Không có dữ liệu</p>
                            )}
                        </div>

                        {/* Bác sĩ */}
                        <div className="subbox">
                            <h4>Bác sĩ phụ trách</h4>
                            {healthRecord.doctor?.length ? (
                                <ul>
                                    {healthRecord.doctor.map((d, i) => (
                                        <li key={i}>
                                            {d.user?.fullName}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty">Chưa có bác sĩ phụ trách</p>
                            )}
                        </div>

                        {/* Lịch khám */}
                        <div className="subbox">
                            <h4><FaCalendarCheck /> Lịch khám</h4>
                            {healthRecord.appointmentSchedules?.length ? (
                                <ul>
                                    {healthRecord.appointmentSchedules.map((a, i) => (
                                        <li key={i}>
                                            Ngày: {a.date} – Giờ: {a.time}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty">Không có lịch khám</p>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
