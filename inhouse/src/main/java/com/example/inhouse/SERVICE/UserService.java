package com.example.inhouse.SERVICE;

import com.example.inhouse.MODEL.User;
import com.example.inhouse.REPOSITORY.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;


    public List<User> getAllUsers(){
        return repo.findAll();
    }
//
//    public Optional<User> getUserById(long id){
//        return repo.findById(id);
//    }

    public User addUser(User user){
        return repo.save(user);
    }

//    public User updateUser (long id, User updatedUser){
//        return repo.save(updatedUser);
//    }
//
//    public void deleteUser(long id){
//        repo.deleteById(id);
//    }
}
