package com.example.inhouse.MODEL;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users_login")
@Getter
@Setter
@NoArgsConstructor

public class UserLogin {

    @Id
    //Provided by Firebase, so no auto-generation
    private long uid;
    private String email;



}
