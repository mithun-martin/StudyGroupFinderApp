package com.example.inhouse.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class StudyGroupRequestDTO {
    private String subject;
    private String topic;
    private String year;
    private String branch;
    private List<String> uid;  // add this line

    //
    // You don’t even need members in the DTO if you're not using it on creation:
    //

    // private List<Long> members;

}
