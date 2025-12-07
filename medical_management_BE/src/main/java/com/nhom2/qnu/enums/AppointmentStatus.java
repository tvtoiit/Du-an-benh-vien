package com.nhom2.qnu.enums;

public enum AppointmentStatus {

    CHO_KHAM("Chờ khám"),
    DANG_KHAM("Đang khám"),
    CHI_DINH_CLS("Chỉ định CLS"),
    HOAN_THANH_CLS("Hoàn thành CLS"),
    DA_KET_LUAN("Đã kết luận"),
    DA_KE_DON("Đã kê đơn"),
    DA_THANH_TOAN("Đã thanh toán");

    private final String label;

    AppointmentStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
