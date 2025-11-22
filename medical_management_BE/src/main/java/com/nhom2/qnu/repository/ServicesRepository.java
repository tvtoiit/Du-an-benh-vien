package com.nhom2.qnu.repository;

import com.nhom2.qnu.model.Services;
import com.nhom2.qnu.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicesRepository extends JpaRepository<Services, String> {

}
