// src/components/Patient/RegisterModal.jsx
import React, { useState, useEffect } from "react";
import "../../../styles/Home.css";
import patientService from "../../../services/parentService";
import { toast } from "react-toastify";

export default function RegisterModal({ onClose }) {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    dateOfBirth: "",
    otherInfo: "",
    otherInfoEHealth: ""
  });

  useEffect(() => {
    patientService
      .getWaitingPatients()
      .then((data) => setUsers(data))
      .catch((err) => console.error("Lỗi load danh sách user:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await patientService.create(formData);
      toast.success("✅ Đăng ký thành công!!");
      onClose(true);
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert("Lỗi: " + (error.response.data.error || "Không xác định!"));
      } else {
        toast.error("❌ Không thể kết nối server!");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Thêm Bệnh Nhân</h2>
          <button className="close-btn" onClick={() => onClose(false)}>✖</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>

          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="select-box"
            required
          >
            <option value="">-- Chọn tài khoản người dùng --</option>
            {users.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.fullName} — {u.email}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <textarea
            name="otherInfo"
            placeholder="Nhu cầu khám bệnh / Ghi chú"
            value={formData.otherInfo}
            onChange={handleChange}
            required
          />

          <textarea
            name="otherInfoEHealth"
            placeholder="Thông tin hồ sơ sức khỏe điện tử"
            value={formData.otherInfoEHealth}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-blue">GỬI ĐI</button>
        </form>
      </div>
    </div>
  );
}
