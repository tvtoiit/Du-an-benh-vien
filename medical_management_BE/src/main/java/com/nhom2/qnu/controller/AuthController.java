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
    public ResponseEntity<?> signIn(@RequestBody LoginRequest loginRequest) {

        Object result = authService.signin(loginRequest);

        // Nếu là ApiResponse → trả status theo ApiResponse
        if (result instanceof ApiResponse) {
            ApiResponse res = (ApiResponse) result;
            return ResponseEntity
                    .status(res.getStatus())
                    .body(res);
        }

        // Nếu là JwtResponse → login OK
        return ResponseEntity.ok(result);
    }

    @PostMapping("/signupuser")
    public ResponseEntity<?> signUpUser(@RequestBody SignupRequest signupRequest) {

        ApiResponse response = authService.signUpUser(signupRequest);

        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {

        ApiResponse response = authService.forgotPassword(body.get("email"));

        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPass(@RequestBody Map<String, String> body) {

        ApiResponse response = authService.resetPassword(
                body.get("email"),
                body.get("otp"),
                body.get("newPassword"));

        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {

        ApiResponse response = authService.verifyOtp(
                body.get("email"),
                body.get("otp"));

        return ResponseEntity
                .status(response.getStatus())
                .body(response);
    }
}
