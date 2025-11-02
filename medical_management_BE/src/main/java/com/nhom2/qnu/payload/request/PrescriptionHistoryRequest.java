package com.nhom2.qnu.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrescriptionHistoryRequest {
    private String patientId;
    private String medicineId;
    private String dosage;
    private String duration;
}
