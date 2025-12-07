package com.nhom2.qnu.payload.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import lombok.Data;

@Getter
@Setter
public class PrescriptionHistoryRequest {

    private String patientId;
    private String appointmentId;
    private String note;

    private List<Detail> details;

    @Data
    public static class Detail {
        private String medicineId;
        private String dosage;
        private String duration;
        private Integer quantity;
    }
}
