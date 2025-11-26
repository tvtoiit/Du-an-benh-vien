package com.nhom2.qnu.service.impl;

import com.nhom2.qnu.model.Account;
import com.nhom2.qnu.model.Role;
import com.nhom2.qnu.model.Token;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.enums.NameRoleEnum;
import com.nhom2.qnu.enums.TokenEnum;
import com.nhom2.qnu.exception.DataExistException;
import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.payload.request.login_signup.LoginRequest;
import com.nhom2.qnu.payload.request.login_signup.SignupRequest;
import com.nhom2.qnu.payload.response.ApiResponse;
import com.nhom2.qnu.payload.response.JwtResponse;
import com.nhom2.qnu.repository.AccountRepository;
import com.nhom2.qnu.repository.RoleRepository;
import com.nhom2.qnu.repository.TokenRepository;
import com.nhom2.qnu.repository.UserRepository;
import com.nhom2.qnu.service.AuthService;
import com.nhom2.qnu.service.EmailService;
import com.nhom2.qnu.utils.JwtProviderUtils;

import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProviderUtils tokenProvider;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public JwtResponse signin(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateTokenUsingUserName(loginRequest.getUsername());

        var account = accountRepository.findByusername(loginRequest.getUsername());
        revokeAllUserTokens(account);
        saveUserToken(account, jwt);

        return new JwtResponse(jwt);
    }

    @Override
    @Transactional
    public ApiResponse signUpUser(SignupRequest signupRequest) {
        String username = signupRequest.getUsername();
        if (accountRepository.existsByusername(username)) {
            throw new DataExistException("This user with username: " + username + " already exist");
        } else {
            Account account = new Account();
            account.setUsername(signupRequest.getUsername());
            account.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            Role role = roleRepository.findByName(NameRoleEnum.ROLE_USER.name())
                    .orElseThrow(() -> new DataNotFoundException("Role not found"));

            account.setRole(role);
            accountRepository.save(account);
            User user = new User();
            user.setAccount(accountRepository.findById(account.getAccountId()).get());
            user.setFullName(signupRequest.getUser().getFullName());
            user.setPhoneNumber(signupRequest.getUser().getPhoneNumber());
            user.setEmail(signupRequest.getUser().getEmail());
            user.setAddress(signupRequest.getUser().getAddress());
            user.setStatus(Boolean.TRUE);
            userRepository.save(user);
        }

        return new ApiResponse("Create successfully", HttpStatus.CREATED);
    }

    private void saveUserToken(Account account, String jwtToken) {
        Token token = new Token();
        token.setAccount(account);
        token.setToken(jwtToken);
        token.setExpired(false);
        token.setRevoked(false);
        token.setTokenType(TokenEnum.BEARER);
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(Account account) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(account.getAccountId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    @Override
    public ApiResponse forgotPassword(String email) {

        // 1. Kiểm tra email có tồn tại không
        Account account = accountRepository.findByusername(email);

        if (account == null) {
            return new ApiResponse("Email không tồn tại!", HttpStatus.BAD_REQUEST);
        }

        // 2. Tạo mã OTP 6 số
        String otp = String.format("%06d", new Random().nextInt(1000000));

        // 3. Lưu OTP vào bảng token
        Token otpToken = new Token();
        otpToken.setAccount(account);
        otpToken.setToken(otp); // Lưu mã OTP
        otpToken.setTokenType(TokenEnum.OTP); // <--- enum mới, bạn cần thêm
        otpToken.setExpired(false);
        otpToken.setRevoked(false);

        tokenRepository.save(otpToken);

        // 4. Gửi email OTP
        emailService.sendMail(
                email,
                "Mã OTP đặt lại mật khẩu",
                "Mã OTP của bạn là: " + otp + " (có hiệu lực trong 3 phút)");

        return new ApiResponse("Đã gửi OTP về email!", HttpStatus.OK);
    }

    @Override
    public ApiResponse resetPassword(String email, String otp, String newPassword) {

        // 1. Kiểm tra user theo email
        Account account = accountRepository.findByusername(email);

        if (account == null) {
            return new ApiResponse("Email không tồn tại!", HttpStatus.BAD_REQUEST);
        }

        // 2. Tìm OTP trong bảng token
        Optional<Token> otpOptional = tokenRepository.findTopByAccountAccountIdAndTokenTypeOrderByCreatedAtDesc(
                account.getAccountId(), TokenEnum.OTP);

        if (!otpOptional.isPresent()) {
            return new ApiResponse("OTP không hợp lệ!", HttpStatus.BAD_REQUEST);
        }

        Token otpToken = otpOptional.get();

        // 3. Kiểm tra trạng thái OTP
        if (otpToken.isExpired() || otpToken.isRevoked()) {
            return new ApiResponse("OTP đã hết hạn hoặc đã được sử dụng!", HttpStatus.BAD_REQUEST);
        }

        if (!otpToken.getToken().equals(otp)) {
            return new ApiResponse("OTP không đúng!", HttpStatus.BAD_REQUEST);
        }

        // 4. Đổi mật khẩu
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

        // 5. Thu hồi OTP để không dùng lại
        otpToken.setExpired(true);
        otpToken.setRevoked(true);

        tokenRepository.save(otpToken);

        return new ApiResponse("Đổi mật khẩu thành công!", HttpStatus.OK);
    }

    @Override
    public ApiResponse verifyOtp(String email, String otp) {

        Account account = accountRepository.findByusername(email);
        if (account == null) {
            return new ApiResponse("Email không tồn tại!", HttpStatus.BAD_REQUEST);
        }

        Optional<Token> otpOptional = tokenRepository.findTopByAccountAccountIdAndTokenTypeOrderByCreatedAtDesc(
                account.getAccountId(), TokenEnum.OTP);

        if (!otpOptional.isPresent()) {
            return new ApiResponse("OTP không hợp lệ!", HttpStatus.BAD_REQUEST);
        }

        Token otpToken = otpOptional.get();

        if (!otpToken.getToken().trim().equals(otp.trim())) {
            return new ApiResponse("OTP không đúng!", HttpStatus.BAD_REQUEST);
        }

        return new ApiResponse("OTP hợp lệ!", HttpStatus.OK);
    }

}
