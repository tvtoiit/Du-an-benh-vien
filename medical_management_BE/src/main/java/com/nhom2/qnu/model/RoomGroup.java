package com.nhom2.qnu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "tbl_room_group")
public class RoomGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid")

    @GenericGenerator(name = "uuid", strategy = "uuid2")

    @Column(name = "room_group_id", length = 36, nullable = false)
    private String roomGroupId;

    // tên khu phòng
    // ví dụ:
    // Phòng A
    // Phòng B
    @Column(name = "group_name", nullable = false, length = 100)
    private String groupName;

    @OneToMany(mappedBy = "roomGroup", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Services> services = new HashSet<>();

    // danh sách phòng
    // ví dụ:
    // 101
    // 102
    // 103
    @OneToMany(mappedBy = "roomGroup", cascade = CascadeType.ALL, orphanRemoval = true)

    @JsonIgnore
    private Set<Room> rooms = new HashSet<>();
}