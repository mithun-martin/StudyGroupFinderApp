package com.example.inhouse.SERVICE;

import com.example.inhouse.MODEL.StudyGroup;
import com.example.inhouse.MODEL.StudyGroupMember;
import com.example.inhouse.REPOSITORY.StudyGroupRepo;
import com.example.inhouse.REPOSITORY.StudyGroupMemberRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StudyGroupService {

    @Autowired
    private StudyGroupRepo repo;

    public StudyGroup createGroup(StudyGroup group) {
        return repo.save(group);
    }

    public List<StudyGroup> getAllGroups() {
        return repo.findAll();
    }

    public StudyGroup getGroupById(UUID id) {
        return repo.findById(id).orElse(null);
    }
}






















//    @Autowired
//    private StudyGroupRepo repo;
//
//    public List<StudyGroup> getGroupsByYearAndBranch(String year, String branch){
//        return repo.findByYearAndBranch(year,branch);
//
//    }

