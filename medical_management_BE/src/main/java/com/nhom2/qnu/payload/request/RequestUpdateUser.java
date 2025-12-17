package com.nhom2.qnu.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class RequestUpdateUser {
  private String fullName;

  private String phoneNumber;

  private String address;

  private String roleName;

  private Boolean status;

  private String gender;

  private Date dateOfBirth;

}
