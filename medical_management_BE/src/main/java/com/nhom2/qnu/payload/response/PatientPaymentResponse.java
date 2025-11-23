package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientPaymentResponse {
    private String patientId;
    private String fullName;
    private String phoneNumber;
    private Date dateOfBirth;
    private String status;
}
