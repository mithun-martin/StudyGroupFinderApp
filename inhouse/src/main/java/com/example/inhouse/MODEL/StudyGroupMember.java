package com.example.inhouse.MODEL;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "study_groups_members_final")
@Getter
@Setter
@NoArgsConstructor
public class StudyGroupMember {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID groupId;
    private String uid; // from Firebase
}
