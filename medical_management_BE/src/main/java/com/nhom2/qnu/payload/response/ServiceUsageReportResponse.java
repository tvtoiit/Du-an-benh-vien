package com.nhom2.qnu.payload.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceUsageReportResponse {
    private String serviceName;
    private Long usageCount;
    private BigDecimal totalRevenue;
}
