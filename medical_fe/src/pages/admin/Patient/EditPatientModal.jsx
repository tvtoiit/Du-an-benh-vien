import React, { useState, useEffect } from "react";
import patientService from "../../../services/parentService";
import "../../../styles/Home.css";

export default function EditPatientModal({ patient, onClose }) {

    const [formData, setFormData] = useState({
        dateOfBirth: "",
        otherInfo: "",
    });

    useEffect(() => {
        setFormData({
            dateOfBirth: patient.dateOfBirth?.substring(0, 10) || "",
            otherInfo: patient.otherInfo || "",
        });
    }, [patient]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await patientService.update(patient.patientId, formData);
            toast.success("✅ Cập nhật thành công!");
            onClose();
        } catch (error) {
            toast.error("❌ Không thể cập nhật!");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Sửa Thông Tin Bệnh Nhân</h2>
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>

                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="otherInfo"
                        placeholder="Ghi chú"
                        value={formData.otherInfo}
                        onChange={handleChange}
                    />

                    <button type="submit" className="btn btn-blue">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    );
}
