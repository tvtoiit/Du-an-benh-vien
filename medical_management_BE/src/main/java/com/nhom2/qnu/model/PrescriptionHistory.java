package com.nhom2.qnu.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Table(name = "tbl_prescription_history")
@Builder
public class PrescriptionHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "prescription_id", length = 36, nullable = false)
    private String prescriptionId;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patients patient;

    @Column(name = "medicine_id", length = 36, nullable = false)
    private String medicineId;

    @Column(name = "dosage", length = 20, nullable = false)
    private String dosage;

    @Column(name = "duration", length = 20, nullable = false)
    private String duration;

    @OneToMany(mappedBy = "prescriptionHistory")
    private Set<Medicines> medicines = new HashSet<>();

    @OneToOne(mappedBy = "prescriptionHistory")
    private PaymentDetails paymentDetails;
}
