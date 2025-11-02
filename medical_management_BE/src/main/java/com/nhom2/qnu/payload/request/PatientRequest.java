package com.nhom2.qnu.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientRequest {

    private String userId;

    private String fullName;

    private String contactNumber;

    private String email;

    private Date dateOfBirth;

    private String address;

    private String otherInfo;

    private String otherInfoEHealth;
}
