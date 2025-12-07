package com.nhom2.qnu.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Table(name = "tbl_patients")
public class Patients implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "patient_id", length = 36, nullable = false)
    private String patientId;

    @Column(name = "date_of_birth", nullable = false)
    private Date dateOfBirth;

    @Column(name = "other_info", nullable = false)
    private String otherInfo;

    @OneToMany(mappedBy = "patients", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<AppointmentSchedules> appointmentSchedules = new HashSet<>();

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<PrescriptionHistory> prescriptionHistory = new HashSet<>();

    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private EHealthRecords eHealthRecords;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User user;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<PaymentDetails> paymentDetails = new HashSet<>();

    // @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    // @JoinTable(name = "tbl_patient_service", joinColumns = @JoinColumn(name =
    // "patient_id", referencedColumnName = "patient_id"), inverseJoinColumns =
    // @JoinColumn(name = "service_id", referencedColumnName = "service_id"))
    // @JsonIgnore
    // private Set<Services> services = new HashSet<>();
}
