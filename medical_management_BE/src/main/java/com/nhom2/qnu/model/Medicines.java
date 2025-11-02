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
@Table(name = "tbl_medicines")
public class Medicines implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "medicine_id", length = 36, nullable = false)
    private String medicineId;

    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Column(name = "unit", length = 20, nullable = false)
    private  String unit;

    @Column(name = "quantity", length = 20, nullable = false)
    private  int quantity;

    @Column(name = "price", nullable = false, length = 18)
    private BigDecimal price;

    @ManyToOne
    private PrescriptionHistory prescriptionHistory;
}
