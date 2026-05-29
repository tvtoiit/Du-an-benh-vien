package com.nhom2.qnu.payload.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorRequest {

    // user sẽ trở thành bác sĩ
    private String userId;

    // trình độ
    // ví dụ:
    // Bác sĩ
    // Thạc sĩ
    // Tiến sĩ
    private String degree;

    // phí khám
    private BigDecimal consultationFee;

    // phòng khám
    // ví dụ:
    // 101
    // 102
    private String roomId;
}