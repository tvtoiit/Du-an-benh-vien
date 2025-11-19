package com.nhom2.qnu.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdvancePaymentRequest {
    @NotBlank(message = "patientId is required")
    private String patientId;

    @NotNull(message = "amount is required")
    @Min(value = 0, message = "amount must be >= 0")
    private Double amount;

    private String note;
    private String createdBy;
}
