package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientServiceResponse {

    private String patientId;

    private String appointmentId;

    private String fullName;
    private String gender;
    private Date dateOfBirth;
    private String cccd;
    private String phoneNumber;

    private String serviceId;

    private String serviceName;
}
