package com.nhom2.qnu.payload.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ServiceResultRequest {
    private String patientId;
    private String serviceId;
    private String doctorId;
    private String appointmentScheduleId;
    private String medicalHistoryId;
    private String resultData;
    private String note;
    private String status;
    private MultipartFile imageFile;
}
