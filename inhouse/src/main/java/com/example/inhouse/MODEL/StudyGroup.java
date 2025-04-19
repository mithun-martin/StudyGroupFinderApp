package com.example.inhouse.MODEL;


import com.example.inhouse.MODEL.StudyGroupMember;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;


import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "study_groups_final")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID groupId;

    private String branch;
    private String subject;
    private int year;
    private String topic;
}
