package com.nhom2.qnu.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateMyProfileRequest {
    private String fullName;
    private String phoneNumber;
    private String address;
}
