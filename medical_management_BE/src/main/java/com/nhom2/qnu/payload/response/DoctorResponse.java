package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorResponse {

    private String doctorId;

    private String doctorName;

    private String email;

    private String cccd;

    private String contactNumber;

    // trình độ
    private String degree;

    // phí khám
    private BigDecimal consultationFee;

    // số phòng
    private String roomName;

    // khu phòng
    private String roomGroupName;
}