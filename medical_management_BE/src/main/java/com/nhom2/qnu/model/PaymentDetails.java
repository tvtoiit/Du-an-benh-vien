package com.nhom2.qnu.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_payment_details")
public class PaymentDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "payment_detail_id", length = 36, nullable = false)
    private String paymentDetailId;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private Patients patient;

    @OneToOne
    @JoinColumn(name = "prescription_id")
    private PrescriptionHistory prescriptionHistory;

    @Column(name = "total_amount", nullable = false, length = 18)
    private BigDecimal total_amount;
}
