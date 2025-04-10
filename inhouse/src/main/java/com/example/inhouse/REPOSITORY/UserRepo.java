package com.example.inhouse.REPOSITORY;

import com.example.inhouse.MODEL.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {
}
