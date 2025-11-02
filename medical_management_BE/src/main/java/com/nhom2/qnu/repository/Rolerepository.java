package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Rolerepository extends JpaRepository<Role, String> {

    Role findByName(String name);
}
