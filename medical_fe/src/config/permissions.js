// src/config/permissions.js

export const permissions = {
    ROLE_BENHNHAN: {
        quanLyUser: false,
        quanLyBenhNhan: false,
        quanLyBacSi: false,
        chiDinhKham: false,
        quanLyKho: false,
        thanhToan: false,
        tiepNhan: false,
        phieuKham: false,
        canLamSang: false,
        keDonThuoc: false,
        thanhToan: false,
    },

    ROLE_USER: {
        quanLyUser: false,
        quanLyBenhNhan: false,
        quanLyBacSi: false,
        chiDinhKham: false,
        quanLyKho: false,
        thanhToan: false,
        tiepNhan: false,
        phieuKham: false,
        canLamSang: false,
        keDonThuoc: false,
        thanhToan: false,
    },

    ROLE_LETAN: {
        quanLyUser: true,
        quanLyBenhNhan: true,   // menu [Quản lí bệnh nhân]
        quanLyBacSi: false,
        chiDinhKham: true,      // menu [Quản lí khám bệnh] -> để dùng màn Tiếp nhận
        quanLyKho: false,
        thanhToan: false,

        // bên trong ExamDashboard
        tiepNhan: true,         // "Tiếp nhận & chỉ định khám"
        phieuKham: false,       // không vào phiếu khám của bác sĩ
        canLamSang: false,
        keDonThuoc: false,
        thanhToan: false,
    },

    // BÁC SĨ: chỉ tập trung Khám bệnh + Cận lâm sàng + Kê đơn
    ROLE_BACSI: {
        quanLyUser: false,
        quanLyBenhNhan: false,
        quanLyBacSi: false,
        chiDinhKham: true,      // menu [Quản lí khám bệnh]
        quanLyKho: false,       // không quản lý kho dược
        thanhToan: false,       // không làm thu ngân

        // bên trong ExamDashboard
        tiepNhan: false,        // không tiếp nhận
        phieuKham: true,        // Khám bệnh (phiếu khám)
        canLamSang: false,       // Chỉ định cận lâm sàng
        keDonThuoc: true,       // Kê đơn thuốc
        thanhToan: false,       // thanh toán để Thu ngân lo
    },

    // CẬN LÂM SÀNG: quản lý dược kho / cận lâm sàng
    ROLE_CANLAMSANG: {
        quanLyUser: false,
        quanLyBenhNhan: false,
        quanLyBacSi: false,
        chiDinhKham: true,
        quanLyKho: true,        // menu [Quản lí dược kho] / Cận lâm sàng
        thanhToan: false,

        // nếu sau này cho vào ExamDashboard thì bật thêm
        tiepNhan: false,
        phieuKham: false,
        canLamSang: true,       // xử lý cận lâm sàng nếu đi chung flow
        keDonThuoc: false,
        thanhToan: false,
    },

    // THU NGÂN: chỉ xử lý thanh toán
    ROLE_THUNGAN: {
        quanLyUser: false,
        quanLyBenhNhan: false,
        quanLyBacSi: false,
        chiDinhKham: false,
        quanLyKho: false,
        thanhToan: true,        // menu [Quản lí thu ngân]

        // nếu reuse màn thanh toán trong ExamDashboard
        tiepNhan: false,
        phieuKham: false,
        canLamSang: false,
        keDonThuoc: false,
        thanhToan: true,        // "Thanh toán & hoàn tất"
    },

    // (nếu có) NHÀ THUỐC riêng
    ROLE_NHATHUOC: {
        quanLyUser: false,
        quanLyBenhNhan: false,
        quanLyBacSi: false,
        chiDinhKham: false,
        quanLyKho: true,
        thanhToan: false,

        tiepNhan: false,
        phieuKham: false,
        canLamSang: false,
        keDonThuoc: true,       // quản lý/toa thuốc
        thanhToan: false,
    },

    // ADMIN: full quyền tất cả menu + tất cả feature bên trong
    ROLE_ADMIN: {
        // menu chính trong MedicalDashboard
        quanLyUser: true,
        quanLyBenhNhan: true,
        quanLyBacSi: true,
        chiDinhKham: true,
        quanLyKho: true,
        thanhToan: true,

        // các chức năng chi tiết trong ExamDashboard
        tiepNhan: true,
        phieuKham: true,
        canLamSang: true,
        keDonThuoc: true,
        thanhToan: true,
    },
};

export default permissions;
