package com.nhom2.qnu.payload.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ServiceRequest {
    
    private String serviceName;
    private  String description;
    private BigDecimal price;
}
