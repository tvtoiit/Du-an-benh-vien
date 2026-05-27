package com.nhom2.qnu.payload.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DoctorRequest {
    private String userId;
    private String doctorName;
    private String contactNumber;
    private String email;
    private String degree;
    private BigDecimal consultationFee;
}
