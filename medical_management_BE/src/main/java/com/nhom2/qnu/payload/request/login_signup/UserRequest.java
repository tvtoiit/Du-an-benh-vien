package com.nhom2.qnu.payload.request.login_signup;

import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@ToString
public class UserRequest {

    private String fullName;

    private String phoneNumber;

    private String email;

    private String address;

    private Boolean status;

}
