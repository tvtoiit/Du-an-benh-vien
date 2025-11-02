package com.nhom2.qnu.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_e_health_records")
public class EHealthRecords implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "record_id", length = 36, nullable = false)
    private String recordId;

    @OneToOne
    @JoinColumn(name = "patient_id")
    private Patients patient;

    @Column(name = "other_info", length = 250)
    private String otherInfo ;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinTable(name = "tbl_medical_record_doctor",
            joinColumns = @JoinColumn(name = "record_id", referencedColumnName = "record_id"),
            inverseJoinColumns = @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id"))
    private Set<Doctor> doctors = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
    @JoinTable(name = "tbl_medical_record_history",
            joinColumns = @JoinColumn(name = "record_id", referencedColumnName = "record_id"),
            inverseJoinColumns = @JoinColumn(name = "medical_history_id", referencedColumnName = "medical_history_id"))
    private Set<MedicalHistories> medicalHistories = new HashSet<>();
}
