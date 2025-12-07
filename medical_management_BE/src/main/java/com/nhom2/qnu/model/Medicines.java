package com.nhom2.qnu.model;

import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tbl_medicines")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Medicines {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "medicine_id", length = 36)
    private String medicineId;

    private String name;
    private String unit;
    private int quantity;
    private BigDecimal price;
}
