package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DoctorResponse {

    private String doctorId;
    private String doctorName;
    private int experience;
    private String contactNumber;
    private String email;
    private String departmentName;
    private List<String> roomNames;
}
