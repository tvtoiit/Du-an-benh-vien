package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorResponse {

    private String doctorId;
    private String doctorName;
    private String email;
    private String contactNumber;

    private int experience;

    private String departmentName;

    private List<String> roomNames;
}
