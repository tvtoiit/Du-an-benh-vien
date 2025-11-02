package com.nhom2.qnu.payload.request;

import com.nhom2.qnu.model.Patients;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class EHealthRecordsRequest {

    private String otherInfo;
}
