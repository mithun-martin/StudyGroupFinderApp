package com.example.inhouse.CONTROLLER;

import com.example.inhouse.MODEL.User;
import com.example.inhouse.SERVICE.UserService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3001")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/signup")
    public ResponseEntity<User> addUser(@RequestBody User addUser){
        User savedUser = service.addUser(addUser);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }

    @GetMapping("all")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = service.getAllUsers();
        return new ResponseEntity<>(users,HttpStatus.OK);

    }
}
