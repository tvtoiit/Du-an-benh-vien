package com.nhom2.qnu.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DoctorRequest {
    private String userId;
    private String doctorName;
    private Integer experience;
    private String contactNumber;
    private String email;
    private String departmentId;
}
