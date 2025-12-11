package com.nhom2.qnu.payload.request;

import java.time.LocalDate;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserAdminRequest {
  private String fullName;

  private String phoneNumber;

  private String email;

  private String address;

  private String gender;

  private Date dateOfBirth;

  private String roleName;
}
