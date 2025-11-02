package com.nhom2.qnu.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EHealthRecordsResponse {

    private String recordId;
    private PatientResponse patient;
    private String otherInfo;
    private List<MedicalHistoriesResponse> medicinesHistories;
    private List<DoctorResponse> doctor;
    private List<AppointmentSchedulesResponse> AppointmentSchedules;
}
