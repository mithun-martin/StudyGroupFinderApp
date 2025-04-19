package com.example.inhouse.REPOSITORY;

import com.example.inhouse.MODEL.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLoginRepo extends JpaRepository<UserLogin,Long> {
}
