package com.nhom2.qnu.service;

import com.nhom2.qnu.payload.request.login_signup.LoginRequest;
import com.nhom2.qnu.payload.request.login_signup.SignupRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.JwtResponse;

public interface AuthService {

    JwtResponse signin(LoginRequest loginRequest);

    ApiResponse signUpUser(SignupRequest signupRequest);
}
