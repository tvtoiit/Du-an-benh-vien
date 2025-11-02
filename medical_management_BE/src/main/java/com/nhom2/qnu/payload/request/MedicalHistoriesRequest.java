package com.nhom2.qnu.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicalHistoriesRequest {
    
    private String testResults;
    private Date admissionDate;
    private Date dischargeDate;

    private String patientId;
    private String doctorId;

}
