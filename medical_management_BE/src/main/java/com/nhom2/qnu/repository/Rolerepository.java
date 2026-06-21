package com.nhom2.qnu.repository;

import com.nhom2.qnu.enums.TokenEnum;
import com.nhom2.qnu.model.Role;
import com.nhom2.qnu.model.Token;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    // Role findByName(String name);
    Optional<Role> findByName(String name);

    @Query("""
                SELECT r
                FROM Role r
                WHERE r.name NOT IN ('ROLE_BACSI', 'ROLE_BENHNHAN')
            """)
    List<Role> findAllForUserManagement();
}
