package com.example.inhouse.CONTROLLER;

import com.example.inhouse.MODEL.StudyGroup;
import com.example.inhouse.SERVICE.StudyGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/study-groups")
@CrossOrigin(origins = "http://localhost:3000")
public class StudyGroupController {
    @Autowired
    private StudyGroupService service;

    @PostMapping("/create")
    public ResponseEntity<StudyGroup> createGroup(@RequestBody StudyGroup group) {
        return ResponseEntity.ok(service.createGroup(group));
    }

    @GetMapping("/all")
    public ResponseEntity<List<StudyGroup>> getAllGroups() {
        return ResponseEntity.ok(service.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyGroup> getGroup(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getGroupById(id));
    }

}