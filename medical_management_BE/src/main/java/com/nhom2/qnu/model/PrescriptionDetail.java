package com.nhom2.qnu.model;

import lombok.*;
import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tbl_prescription_detail")
public class PrescriptionDetail {

    @Id
    @GeneratedValue(generator = "uuid")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private PrescriptionHistory prescriptionHistory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id")
    private Medicines medicine;

    private Integer quantity; // Số lượng dùng
    private String dosage; // liều dùng
    private String duration; // số ngày dùng
}
