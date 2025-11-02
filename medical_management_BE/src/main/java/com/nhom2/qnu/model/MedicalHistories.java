package com.nhom2.qnu.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_medical_histories")
public class MedicalHistories implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "medical_history_id", length = 36, nullable = false)
    private String medicalHistoryId;

    @Column(name = "test_results", nullable = false)
    private String testResults;

    @Column(name = "admission_date", nullable = false)
    private Date admissionDate;

    @Column(name = "discharge_date", nullable = false)
    private Date dischargeDate;

    @ManyToMany(mappedBy = "medicalHistories", fetch = FetchType.LAZY)
    private Set<EHealthRecords> eHealthRecords = new HashSet<>();
}
