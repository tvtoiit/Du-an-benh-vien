package com.nhom2.qnu.payload.response;
import com.nhom2.qnu.model.Patients;
import com.nhom2.qnu.model.PaymentDetails;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PrescriptionHistoryResponse {

    private String prescriptionId;
    private Patients patient;
    private String medicineId;
    private String dosage;
    private String duration;
    private PaymentDetails paymentDetails;
}
