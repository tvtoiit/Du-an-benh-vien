package com.nhom2.qnu.payload.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientResponse{

    private String patientId;

    private String fullName;

    private  String contactNumber;

    private  String email;

    private Date dateOfBirth;

    private String address;

    private String otherInfo;
}