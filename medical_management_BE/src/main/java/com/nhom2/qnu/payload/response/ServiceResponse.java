package com.nhom2.qnu.payload.response;

import java.math.BigDecimal;

import com.nhom2.qnu.enums.ServiceType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {
    private String serviceId;
    private String serviceName;
    private String description;
    private BigDecimal price;
    private ServiceType serviceType;
}
