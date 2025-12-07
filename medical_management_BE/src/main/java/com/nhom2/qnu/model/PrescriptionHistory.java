package com.nhom2.qnu.model;

import lombok.*;

import javax.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_prescription_history")
public class PrescriptionHistory {

    @Id
    @GeneratedValue(generator = "uuid")
    private String prescriptionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patients patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_schedule_id")
    private AppointmentSchedules appointment;

    @Column(columnDefinition = "TEXT")
    private String note;

    // ⬇⬇⬇ THÊM / SỬA TẠI ĐÂY ⬇⬇⬇
    @OneToMany(mappedBy = "prescriptionHistory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PrescriptionDetail> details = new ArrayList<>();
}