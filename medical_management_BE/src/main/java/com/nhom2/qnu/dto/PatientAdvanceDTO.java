package com.nhom2.qnu.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientAdvanceDTO {
    private String patientId;
    private String fullName;
    private String phoneNumber;
    private String address;
    private Double totalAdvance;
}
