package com.nhom2.qnu.payload.response;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PrescriptionDetailResponse {
    private String medicineName;
    private Integer quantity;
    private String unit;
    private String usage;
}
