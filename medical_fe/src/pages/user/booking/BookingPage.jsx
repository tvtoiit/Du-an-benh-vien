import React, { useState, useEffect } from "react";
import bookingService from "../../../services/parentService";
import loginService from "../../../services/loginService";
import "../../../styles/booking.css";
import { toast } from "react-toastify";

export default function BookingPage() {

    const [userId, setUserId] = useState(null);

    const [form, setForm] = useState({
        date: "",
        time: "",
        symptoms: ""
    });

    // ⭐ Load userId khi mở trang (KHÔNG phải khi submit)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        loginService.loginCheckUser(token)
            .then(res => setUserId(res.userId))
            .catch(() => setUserId(null));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.date || !form.time) {
            toast.error("Vui lòng chọn ngày và giờ khám!");
            return;
        }

        if (!userId) {
            toast.error("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại!");
            return;
        }

        const requestBody = {
            userId,
            dateOfBirth: new Date(`${form.date}T${form.time}:00`),
            otherInfo: form.symptoms
        };

        try {
            await bookingService.create(requestBody);
            toast.success("Đặt lịch khám thành công!");

            // Reset form
            setForm({ date: "", time: "", symptoms: "" });

        } catch (err) {
            toast.error("Đặt lịch thất bại!");
        }
    };

    return (
        <div className="booking-page">
            <div className="booking-container">

                <h2>Đặt lịch khám</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Ngày khám</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Giờ khám</label>
                        <select
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                        >
                            <option value="">-- Chọn giờ --</option>
                            <option value="07:30">07:30</option>
                            <option value="08:00">08:00</option>
                            <option value="08:30">08:30</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Triệu chứng</label>
                        <textarea
                            placeholder="Nhập triệu chứng của bạn"
                            value={form.symptoms}
                            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                        />
                    </div>

                    <button className="btn-submit">Xác nhận đặt lịch</button>
                </form>

            </div>
        </div>
    );
}
