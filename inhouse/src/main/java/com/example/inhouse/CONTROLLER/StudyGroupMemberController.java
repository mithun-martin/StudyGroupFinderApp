package com.example.inhouse.CONTROLLER;

import com.example.inhouse.MODEL.StudyGroupMember;
import com.example.inhouse.SERVICE.StudyGroupMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class StudyGroupMemberController {


    @Autowired
    private StudyGroupMemberService service;

    @PostMapping("/add")
    public ResponseEntity<StudyGroupMember> addMember(
            @RequestParam UUID groupId,
            @RequestParam String uid) {
        return ResponseEntity.ok(service.addMember(groupId, uid));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<List<StudyGroupMember>> getMembers(@PathVariable UUID groupId) {
        return ResponseEntity.ok(service.getMembersByGroupId(groupId));
    }

}
