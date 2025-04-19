package com.example.inhouse.SERVICE;

import com.example.inhouse.MODEL.UserLogin;
import com.example.inhouse.REPOSITORY.UserLoginRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserLoginService {

    @Autowired
    private UserLoginRepo repo;

    public UserLogin saveLogin(UserLogin user){
        return repo.save(user);
    }
}
