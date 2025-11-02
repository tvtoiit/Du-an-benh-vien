import React, { useState } from "react";
import "../../styles/Home.css";

export default function RegisterModal({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
    otherInfo: "",
    otherInfoEHealth: ""
  });

  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/v1/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Đăng ký thành công!");
        onClose();
      } else {
        const errMsg = await res.text();
        alert("Lỗi: " + errMsg);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối server!");
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
