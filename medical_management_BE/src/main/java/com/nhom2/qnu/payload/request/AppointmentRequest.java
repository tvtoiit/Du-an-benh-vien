package com.nhom2.qnu.payload.request;

import lombok.Data;
import java.util.List;

@Data
public class AppointmentRequest {

    private String patientId;
    private String doctorId;
    private String room;
    private String note;

    // danh sách dịch vụ FE gửi lên
    private List<String> serviceIds;
}
