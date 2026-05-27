package com.nhom2.qnu.model;

import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

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

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    // viên, chai, hộp,...
    @Column(name = "unit", length = 50)
    private String unit;

    // mô tả thuốc
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}