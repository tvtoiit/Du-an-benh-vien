package com.nhom2.qnu.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.Set;
import java.util.HashSet;
import lombok.Getter;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_department")
public class Department implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "department_id", length = 36, nullable = false)
    private String departmentId;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // 1 Department -> N Doctors
    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Doctor> doctors = new HashSet<>();

    // 1 Department -> N Rooms
    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Room> rooms = new HashSet<>();

    @PrePersist
    public void prePersist() {
        if (this.departmentId == null || this.departmentId.isEmpty()) {
            this.departmentId = java.util.UUID.randomUUID().toString();
        }
    }
}
