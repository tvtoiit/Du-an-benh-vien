package com.nhom2.qnu.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.nhom2.qnu.exception.DataNotFoundException;
import com.nhom2.qnu.utils.JwtProviderUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.nhom2.qnu.model.Account;
import com.nhom2.qnu.model.Doctor;
import com.nhom2.qnu.model.Role;
import com.nhom2.qnu.model.User;
import com.nhom2.qnu.payload.request.RequestUpdateUser;
import com.nhom2.qnu.payload.request.UserAdminRequest;
import com.nhom2.qnu.payload.response.UserAdminResponse;
import com.nhom2.qnu.repository.AccountRepository;
import com.nhom2.qnu.repository.DoctorRepository;
import com.nhom2.qnu.repository.RoleRepository;
import com.nhom2.qnu.repository.UserRepositories;
import com.nhom2.qnu.repository.UserRepository;
import com.nhom2.qnu.service.UserAdminService;

@Service
public class UserAdminServiceImpl implements UserAdminService {

  @Autowired
  private UserRepositories userRepositories;

  @Autowired
  private RoleRepository roleRepositories;

  @Autowired
  private AccountRepository accountRepository;

  @Autowired
  private JwtProviderUtils jwtProviderUtils;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private UserRepository usersRepository;

  @Override
  public ResponseEntity<Object> getAllUSerAdmin() {
    List<User> lst = userRepositories.findByStatus(true);
    // List<User> lst = userRepositories.findAll();
    if (lst.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    List<UserAdminResponse> response = new ArrayList<>();
    for (User user : lst) {
      UserAdminResponse respon = UserAdminResponse
          .builder()
          .userId(user.getUserId())
          .accountId(user.getAccount().getAccountId())
          .address(user.getAddress())
          .createdAt(user.getCreatedAt())
          .updatedAt(user.getUpdatedAt())
          .email(user.getEmail())
          .fullName(user.getFullName())
          .status(user.getStatus())
          .phoneNumber(user.getPhoneNumber())
          .build();
      response.add(respon);
    }
    return ResponseEntity.ok().body(response);
  }

  @Override
  public ResponseEntity<Object> getUSerAdminByToken(String token) {
    User user = getUserOfSocket(token);

    // Mặc định không có doctorId
    String doctorId = null;

    // Nếu role là DOCTOR thì mới cố lấy doctor
    String roleName = user.getAccount().getRole().getName();
    if ("ROLE_BACSI".equalsIgnoreCase(roleName)) {
      doctorId = doctorRepository
          .findByUser_UserId(user.getUserId())
          .map(Doctor::getDoctorId)
          .orElse(null);
    }

    UserAdminResponse response = UserAdminResponse
        .builder()
        .userId(user.getUserId())
        .accountId(user.getAccount().getAccountId())
        .role(roleName)
        .doctorId(doctorId)
        .address(user.getAddress())
        .createdAt(user.getCreatedAt())
        .updatedAt(user.getUpdatedAt())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .status(user.getStatus())
        .phoneNumber(user.getPhoneNumber())
        .build();

    return ResponseEntity.ok().body(response);
  }

  @Override
  public ResponseEntity<Object> createUSerAdmin(UserAdminRequest request) {

    // 1. Check email trùng
    Optional<User> existEmail = userRepositories.findUserByEmail(request.getEmail());
    if (existEmail.isPresent()) {
      return ResponseEntity
          .badRequest()
          .body(Map.of("error", "Email đã tồn tại, vui lòng nhập email khác!"));
    }

    Account existAcc = accountRepository.findByusername(request.getEmail());
    if (existAcc != null) {
      return ResponseEntity
          .badRequest()
          .body(Map.of("error", "Tài khoản đã tồn tại, vui lòng dùng email khác!"));
    }

    // 2. Lấy role USER tự động
    Role role = roleRepositories.findByName("ROLE_USER");
    if (role == null) {
      return ResponseEntity.badRequest().body("Role USER not found");
    }

    // 3. Tạo account
    Account acc = Account.builder()
        .username(request.getEmail())
        .password(request.getEmail())
        .role(role)
        .build();

    // 👉 BẮT BUỘC SAVE ACCOUNT TRƯỚC
    accountRepository.save(acc);

    // 4. Tạo user
    User userCreate = User.builder()
        .account(acc)
        .address(request.getAddress())
        .email(request.getEmail())
        .fullName(request.getFullName())
        .status(true)
        .phoneNumber(request.getPhoneNumber())
        .build();

    // 5. Lưu user
    userRepositories.save(userCreate);

    UserAdminResponse respon = UserAdminResponse.builder()
        .userId(userCreate.getUserId())
        .accountId(userCreate.getAccount().getAccountId())
        .fullName(userCreate.getFullName())
        .email(userCreate.getEmail())
        .phoneNumber(userCreate.getPhoneNumber())
        .address(userCreate.getAddress())
        .status(userCreate.getStatus())
        .build();

    return ResponseEntity.ok(respon);
  }

  @Override
  public ResponseEntity<Object> delete(String id) {
    Optional<User> user = userRepositories.findUserByStatus(id);
    if (user.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    user.get().setStatus(false);
    userRepositories.save(user.get());
    return ResponseEntity.ok().body("Delete Success");
  }

  @Override
  public ResponseEntity<Object> updateUser(String id, RequestUpdateUser request) {
    Optional<User> optionalUser = userRepositories.findById(id);
    if (optionalUser.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "User không tồn tại"));
    }

    User user = optionalUser.get();

    // Cập nhật fullName nếu FE gửi đúng
    if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
      user.setFullName(request.getFullName());
    }

    // Cập nhật status
    if (request.getStatus() != null) {
      user.setStatus(request.getStatus());
    }

    // Cập nhật phoneNumber
    if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
      user.setPhoneNumber(request.getPhoneNumber());
    }

    // Cập nhật address
    if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
      user.setAddress(request.getAddress());
    }

    // Cập nhật role nếu có thay đổi
    if (request.getRoleName() != null && !request.getRoleName().trim().isEmpty()) {
      Role role = roleRepositories.findByName(request.getRoleName());
      if (role != null) {
        user.getAccount().setRole(role);
      }
    }

    userRepositories.save(user);

    return ResponseEntity.ok(Map.of("message", "Update Success"));
  }

  public User getUserOfSocket(String token) {
    String username = jwtProviderUtils.getUserNameFromJwtToken(token);
    Account account = accountRepository.findByusername(username);
    User user = userRepositories.findById(account.getUser().getUserId())
        .orElseThrow(() -> new DataNotFoundException("User does not exist"));
    return user;
  }

  public List<User> getPatients() {
    List<User> list = usersRepository.findUsersByRoleName("ROLE_USER");
    return list;
  }

}
