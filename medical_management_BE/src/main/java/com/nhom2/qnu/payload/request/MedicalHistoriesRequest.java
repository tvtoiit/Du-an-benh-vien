package com.nhom2.qnu.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicalHistoriesRequest {

    // Các trường từ form khám lâm sàng
    private String symptom; // Triệu chứng lâm sàng
    private String result; // Kết quả khám ban đầu
    private String diagnosis; // Chẩn đoán chính
    private String secondaryDiagnosis; // Chẩn đoán phụ (nếu có)
    private String note; // Ghi chú khác

    /**
     * Nếu FE muốn gửi chuỗi hoàn chỉnh thì có thể set vào đây.
     * Nếu null/empty thì Service sẽ tự build từ các trường trên.
     */
    private String testResults;

    // Ngày vào / ra viện (với khám ngoại trú bạn có thể set = ngày khám)
    private Date admissionDate;
    private Date dischargeDate;

    // Liên kết bệnh nhân / bác sĩ
    private String patientId;
    private String doctorId;

    // (OPTIONAL) Nếu sau này bạn muốn link trực tiếp với lịch khám
    // private String appointmentScheduleId;
}
