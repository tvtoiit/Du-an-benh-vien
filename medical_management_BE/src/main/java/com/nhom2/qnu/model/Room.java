package com.nhom2.qnu.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @Column(name = "status", length = 30)
    private String status;

    @ManyToOne(fetch = FetchType.EAGER)

    @JoinColumn(name = "room_group_id")

    @JsonIgnoreProperties({
            "rooms",
            "doctors"
    })
    private RoomGroup roomGroup;
}