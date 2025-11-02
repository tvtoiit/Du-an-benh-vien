package com.nhom2.qnu.payload.response;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class MedicinesResponse {
    
    private String medicineId;
    private String name;
    private  String unit;
    private  int quantity;
    private BigDecimal price;
}
