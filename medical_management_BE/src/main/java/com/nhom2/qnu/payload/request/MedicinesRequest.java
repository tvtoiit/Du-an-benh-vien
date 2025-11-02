package com.nhom2.qnu.payload.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class MedicinesRequest {
    
    private String name;
    private String unit;
    private int quantity;
    private BigDecimal price;
}
