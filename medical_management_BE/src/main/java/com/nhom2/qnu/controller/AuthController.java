package com.nhom2.qnu.controller;

import com.nhom2.qnu.payload.request.login_signup.LoginRequest;
import com.nhom2.qnu.payload.request.login_signup.SignupRequest;
import com.nhom2.qnu.payload.response.JwtResponse;
import com.nhom2.qnu.service.AuthService;
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
}
