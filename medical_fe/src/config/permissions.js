export const permissions = {
    ROLE_LETAN: {
        tiepNhan: true,
        chiDinhKham: true,
        thanhToan: false,
        quanLyBacSi: false,
        baoCao: false
    },

    ROLE_BACSI: {
        tiepNhan: false,
        thanhToan: false,
        chiDinhKham: true,
        quanLyBacSi: false,
        phieuKham: true,
        canLamSang: false,
        baoCao: true
    },

    ROLE_CANLAMSANG: {
        tiepNhan: false,
        thanhToan: false,
        chiDinhKham: true,
        quanLyBacSi: false,
        phieuKham: false,
        canLamSang: true,
        baoCao: false
    },

    ROLE_THUNGAN: {
        tiepNhan: false,
        chiDinhKham: true,
        chiDinhKham: false,
        thanhToan: true,
        quanLyBacSi: false,
        baoCao: true
    },

    ROLE_ADMIN: {
        quanLyUser: true,
        quanLyBenhNhan: true,
        quanLyKho: true,
        quanLyThuNgan: true,
        tiepNhan: true,
        chiDinhKham: true,
        thanhToan: true,
        quanLyBacSi: true,
        baoCao: true,
        keDonThuoc: true,
        phieuKham: true,
        canLamSang: true
    }
};
export default permissions;