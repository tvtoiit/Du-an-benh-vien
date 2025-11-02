package com.nhom2.qnu.payload.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicalHistoriesResponse {
    private String medicalHistoryId;
    private String testResults;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date admissionDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dischargeDate;
}
