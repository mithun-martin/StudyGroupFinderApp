package com.example.inhouse.MODEL;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long uid;


    private String email;
    private String name;

}
