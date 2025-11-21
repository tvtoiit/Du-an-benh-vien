package com.nhom2.qnu.model;

import com.nhom2.qnu.enums.TokenEnum;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.io.Serializable;

@Entity
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Table(name = "tbl_token")
public class Token implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "token_id", length = 36, nullable = false)
    public String tokenId;

    @Column(length = 250, nullable = false, unique = true)
    public String token;

    @Enumerated(EnumType.STRING)
    public TokenEnum tokenType = TokenEnum.BEARER;

    @Column(name = "revoked")
    public boolean revoked;

    @Column(name = "expired")
    public boolean expired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;
}
