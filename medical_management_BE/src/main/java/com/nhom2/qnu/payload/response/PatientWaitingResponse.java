package com.nhom2.qnu.payload.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientWaitingResponse {
    private String patientId;
    private String fullName;
    private String cccd;
    private String phone;
    private LocalDateTime appointmentTime;
    private String status;
    private String note;
    private String room;
    private String appointmentId;
}
