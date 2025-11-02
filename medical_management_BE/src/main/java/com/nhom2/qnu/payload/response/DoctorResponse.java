package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DoctorResponse {
    
    private String doctorId;
    private String doctorName;
    private String specialization;
    private String contactNumber;
    private String email;
}
