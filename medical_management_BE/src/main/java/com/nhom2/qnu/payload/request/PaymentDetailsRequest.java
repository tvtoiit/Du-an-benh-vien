package com.nhom2.qnu.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDetailsRequest {

    @NotBlank(message = "patientId is required")
    private String patientId;

    @NotBlank(message = "appointmentId is required")
    private String appointmentId;

    /**
     * prescriptionId là tùy chọn.
     * Nếu FE không gửi, BE sẽ tự tìm đơn thuốc gắn với appointment đó.
     */
    private String prescriptionId;
}
