package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientServiceResponse {

    private String patientId;

    private String fullName;
    private String gender;
    private Date dateOfBirth;

    private List<ServiceResponse> services;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ServiceResponse {
        private String patientId;

        private String fullName;

        private String contactNumber;

        private String email;

        private Date dateOfBirth;

        private String gender;

        private String address;

        private String otherInfo;

        private String serviceId;

        private String serviceName;
    }
}
