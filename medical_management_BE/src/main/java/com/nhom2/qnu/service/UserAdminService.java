package com.nhom2.qnu.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.RequestUpdateUser;
import com.nhom2.qnu.payload.request.UpdateMyProfileRequest;
import com.nhom2.qnu.payload.request.UserAdminRequest;

@Service
public interface UserAdminService {

  ResponseEntity<Object> getAllUSerAdmin();

  ResponseEntity<Object> getUSerAdminByToken(String token);

  ResponseEntity<Object> createUSerAdmin(UserAdminRequest request);

  ResponseEntity<Object> delete(String id);

  ResponseEntity<Object> updateUser(String id, RequestUpdateUser request);

  List<User> getPatients();

  ResponseEntity<?> updateMyProfile(UpdateMyProfileRequest request);

  ResponseEntity<?> getMyProfile();

}
