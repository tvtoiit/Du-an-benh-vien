package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueReportResponse {
    private String period; // YYYY-MM or YYYY-MM-DD
    private Long totalRevenue;
}
