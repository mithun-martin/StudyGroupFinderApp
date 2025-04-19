package com.example.inhouse.CONTROLLER;

import com.example.inhouse.MODEL.UserLogin;
import com.example.inhouse.SERVICE.UserLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")  // same as signup
@CrossOrigin(origins = "http://localhost:3000")
public class UserLoginController {

    @Autowired
    private UserLoginService service;

    @PostMapping("/login")
    public ResponseEntity<UserLogin> saveLogin(@RequestBody UserLogin user) {
        UserLogin saved = service.saveLogin(user);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }
}
