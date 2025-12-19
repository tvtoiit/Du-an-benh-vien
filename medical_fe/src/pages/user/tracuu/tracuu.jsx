import React, { useState } from "react";
import "../../../styles/tracuu.css";
import loginService from "../../../services/loginService";
import patientService from "../../../services/parentService";
import healthService from "../../../services/health";
import { toast } from "react-toastify";

import {
    FaUser,
    FaStethoscope,
    FaHeartbeat,
    FaCalendarCheck,
    FaPills
} from "react-icons/fa";

export default function TraCuu() {

    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState(null);
    const [healthRecord, setHealthRecord] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) return toast.error("Bạn chưa đăng nhập!");

            const userRes = await loginService.loginCheckUser(token);
            const userId = userRes?.userId;

            if (!userId) return toast.error("Không tìm thấy tài khoản!");

            const patientRes = await patientService.getPatientByUserId(userId);
            if (!patientRes || !patientRes.patientId) {
                toast.error("Không tìm thấy bệnh nhân!");
                setLoading(false);
                return;
            }

            setPatient(patientRes);

            const healthRes = await healthService.getById(patientRes.patientId);
            console.log("Result:", healthRes);

            setHealthRecord(healthRes);

        } catch (err) {
            console.log(err);
            toast.error("Không thể tra cứu!");
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

                {/* -------------------------------- */}
                {/* THÔNG TIN BỆNH NHÂN */}
                {/* -------------------------------- */}
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

                {/* -------------------------------- */}
                {/* HỒ SƠ BỆNH ÁN */}
                {/* -------------------------------- */}
                {healthRecord && (
                    <div className="info-section">
                        <h3 className="section-title">
                            <FaHeartbeat /> Hồ Sơ Bệnh Án
                        </h3>

                        <div className="info-grid">
                            <div className="info-item"><strong>Mã hồ sơ:</strong> {healthRecord.recordId}</div>
                            <div className="info-item"><strong>Ghi chú:</strong> {healthRecord.otherInfo || "Không có"}</div>
                        </div>

                        {/* ---------------- Lịch sử khám bệnh ---------------- */}
                        <div className="subbox">
                            <h4><FaHeartbeat /> Lịch sử khám bệnh</h4>

                            {healthRecord.medicinesHistories?.length ? (
                                <ul className="list-box">
                                    {healthRecord.medicinesHistories.map((m, i) => (
                                        <li key={i} className="list-item">
                                            {/* <strong>Mã khám:</strong> {m.medicalHistoryId} <br /> */}
                                            <strong>Ngày khám:</strong> {new Date(m.admissionDate).toLocaleDateString()} <br />
                                            <strong>Kết quả:</strong> {m.testResults || "Chưa có"} <br />

                                            {/* Bác sĩ khám */}
                                            {m.doctor && (
                                                <>
                                                    <strong>Bác sĩ khám:</strong> {m.doctor.doctorName}
                                                </>
                                            )}

                                            {/* Dịch vụ đã sử dụng */}
                                            {m.services?.length > 0 && (
                                                <div className="service-box">
                                                    <strong><FaPills /> Dịch vụ đã dùng:</strong>
                                                    <ul>
                                                        {m.services.map((s, idx) => (
                                                            <li key={idx}>{s.serviceName}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty">Không có lịch sử khám</p>
                            )}
                        </div>

                        {/* ---------------- Bác sĩ phụ trách (MAIN DOCTOR LIST) ---------------- */}
                        <div className="subbox">
                            <h4><FaStethoscope /> Bác sĩ phụ trách</h4>

                            {healthRecord.doctor?.length ? (
                                <ul className="list-box">
                                    {healthRecord.doctor.map((d, i) => (
                                        <li key={i} className="list-item">
                                            <strong>Họ tên:</strong> {d.doctorName} <br />
                                            <strong>Email:</strong> {d.email} <br />
                                            <strong>SĐT:</strong> {d.contactNumber}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty">Không có bác sĩ phụ trách</p>
                            )}
                        </div>

                        {/* ---------------- Lịch khám ---------------- */}
                        <div className="subbox">
                            <h4><FaCalendarCheck /> Lịch khám</h4>

                            {healthRecord.appointmentSchedules?.length ? (
                                <ul className="list-box">
                                    {healthRecord.appointmentSchedules.map((a, i) => (
                                        <li key={i} className="list-item">
                                            {/* <strong>Mã lịch:</strong> {a.appointmentScheduleId} <br /> */}
                                            <strong>Thời gian:</strong> {new Date(a.appointmentDatetime).toLocaleString()} <br />
                                            <strong>Bác sĩ:</strong> {a.doctor?.doctorName} <br />
                                            <strong>Trạng thái:</strong> {a.status}
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
