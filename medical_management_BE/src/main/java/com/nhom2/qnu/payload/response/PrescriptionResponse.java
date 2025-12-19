package com.nhom2.qnu.payload.response;

import java.util.List;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PrescriptionResponse {
    private String prescriptionId;
    private List<PrescriptionDetailResponse> details;
}
