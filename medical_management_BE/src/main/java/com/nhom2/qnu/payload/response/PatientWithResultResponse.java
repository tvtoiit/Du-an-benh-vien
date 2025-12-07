package com.nhom2.qnu.payload.response;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class PatientWithResultResponse {
    private String patientId;
    private String fullName;
    private String gender;
    private Date dateOfBirth;
    private String contactNumber;
    private String status;
    private String appointmentScheduleId;
}
