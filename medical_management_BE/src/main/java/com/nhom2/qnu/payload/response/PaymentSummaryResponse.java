package com.nhom2.qnu.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentSummaryResponse {

    private String patientId;

    private String fullName;

    private String cccd;

    private String appointmentId;

    // bác sĩ khám
    private String doctorName;

    // phòng khám
    private String roomName;

    // chuyên khoa
    private String roomGroupName;

    private String status;

    // tiền dịch vụ khám / CLS
    private Long serviceFee;

    // tổng thanh toán
    private Long totalCost;
}