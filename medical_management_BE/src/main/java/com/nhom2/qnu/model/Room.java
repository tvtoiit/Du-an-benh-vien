package com.nhom2.qnu.model;

import lombok.*;
import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tbl_room")
public class Room implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "room_id", length = 36, nullable = false)
    private String roomId;

    @Column(name = "room_name", length = 50, nullable = false)
    private String roomName;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
}
