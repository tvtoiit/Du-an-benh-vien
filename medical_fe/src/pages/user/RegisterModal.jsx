import React, { useState, useEffect } from "react";
import "../../styles/Home.css";
import patientService from "../../services/parentService";
import userService from "../../services/userService";

export default function RegisterModal({ onClose }) {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    contactNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
    otherInfo: "",
    otherInfoEHealth: ""
  });

  useEffect(() => {
    userService
      .getAll()
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
      alert("Đăng ký thành công!");
      onClose();
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert("Lỗi: " + (error.response.data.error || "Không xác định!"));
      } else {
        alert("Không thể kết nối server!");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>ĐĂNG KÝ KHÁM VÀ TƯ VẤN</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>

          {/* 🔹 DROPDOWN USER */}
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
            type="text"
            name="fullName"
            placeholder="Họ và tên *"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Điện thoại *"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
          />

          <textarea
            name="otherInfo"
            placeholder="Nhu cầu khám bệnh / Ghi chú"
            value={formData.otherInfo}
            onChange={handleChange}
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
