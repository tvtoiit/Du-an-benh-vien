package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

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
    private String degree;
    private BigDecimal consultationFee;
    private List<String> roomNames;
}
