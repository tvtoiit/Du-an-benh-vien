package com.nhom2.qnu.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.nhom2.qnu.model.User;

@Repository
public interface UserRepositories extends JpaRepository<User, String> {
  @Query(value = "SELECT u.* FROM tbl_user u CROSS JOIN tbl_account a ON u.account_id = a.account_id WHERE u.email = :email OR a.username =:username", nativeQuery = true)
  Optional<User> findUserByUsernameEmail(@Param("username") String username,
      @Param("email") String email);

  @Query(value = "SELECT u.* FROM tbl_user u WHERE u.status = 1 AND u.user_id = :id", nativeQuery = true)
  Optional<User> findUserByStatus(@Param("id") String id);

  Optional<User> findByAccount_Username(String userName);
}
