package com.nhom2.qnu.model;

import lombok.*;
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

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "room_group_id", length = 36)
    private String roomGroupId;

    @Column(name = "group_name", nullable = false, length = 100)
    private String groupName;

    @OneToMany(mappedBy = "roomGroup")
    private Set<Room> rooms = new HashSet<>();

    @OneToMany(mappedBy = "roomGroup")
    private Set<Doctor> doctors = new HashSet<>();
}