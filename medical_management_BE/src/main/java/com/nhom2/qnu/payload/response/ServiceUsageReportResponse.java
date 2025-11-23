package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceUsageReportResponse {
    private String serviceName;
    private Long usageCount; // số lượt dùng
    private Long totalRevenue; // tổng tiền thu được
}
