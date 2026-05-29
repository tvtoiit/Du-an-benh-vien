package com.nhom2.qnu.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_doctor")
public class Doctor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")

    @GenericGenerator(name = "uuid", strategy = "uuid2")

    @Column(name = "doctor_id", length = 36, nullable = false)
    private String doctorId;

    // trình độ
    @Column(name = "degree", length = 100)
    private String degree;

    // phí khám
    @Column(name = "consultation_fee")
    private BigDecimal consultationFee;

    // user
    @OneToOne(fetch = FetchType.LAZY)

    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // lịch hẹn
    @OneToMany(mappedBy = "doctor")

    @JsonIgnoreProperties("doctor")
    public Set<AppointmentSchedules> appointmentSchedules = new HashSet<>();

    // hồ sơ bệnh án
    @ManyToMany(mappedBy = "doctors", fetch = FetchType.LAZY)

    @JsonIgnoreProperties("doctors")
    private Set<EHealthRecords> eHealthRecords = new HashSet<>();

    // PHÒNG KHÁM
    @ManyToOne(fetch = FetchType.LAZY)

    @JoinColumn(name = "room_id")

    @JsonIgnoreProperties({
            "appointmentSchedules"
    })
    private Room room;
}