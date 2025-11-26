package com.nhom2.qnu.controller;

import com.nhom2.qnu.payload.request.ForgotPasswordRequest;
import com.nhom2.qnu.payload.request.ResetPasswordRequest;
import com.nhom2.qnu.payload.request.login_signup.LoginRequest;
import com.nhom2.qnu.payload.request.login_signup.SignupRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.JwtResponse;
import com.nhom2.qnu.service.AuthService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController(value = "authAPIofWeb")
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> signIn(@RequestBody LoginRequest loginRequest) {
        return new ResponseEntity<>(authService.signin(loginRequest), HttpStatus.OK);
    }

    @PostMapping("/signupuser")
    public ResponseEntity<?> signUpUser(@RequestBody SignupRequest signupRequest) {
        return new ResponseEntity<>(authService.signUpUser(signupRequest), HttpStatus.CREATED);
    }

    @PostMapping("/forgot-password")
    public ApiResponse forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request.getEmail());
    }

    // @PostMapping("/reset-password")
    // public ApiResponse resetPassword(@RequestBody ResetPasswordRequest request) {
    // return authService.resetPassword(request.getToken(),
    // request.getNewPassword());
    // }

    @PostMapping("/reset-password")
    public ApiResponse resetPass(@RequestBody Map<String, String> body) {
        return authService.resetPassword(
                body.get("email"),
                body.get("otp"),
                body.get("newPassword"));
    }

    @PostMapping("/verify-otp")
    public ApiResponse verifyOtp(@RequestBody Map<String, String> body) {
        return authService.verifyOtp(body.get("email"), body.get("otp"));
    }

}
