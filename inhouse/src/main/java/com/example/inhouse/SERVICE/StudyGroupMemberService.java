package com.example.inhouse.SERVICE;

import com.example.inhouse.MODEL.StudyGroupMember;
import com.example.inhouse.REPOSITORY.StudyGroupMemberRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudyGroupMemberService {


    @Autowired
    private StudyGroupMemberRepo repo;

    public StudyGroupMember addMember(UUID groupId, String uid) {
        StudyGroupMember member = new StudyGroupMember();
        member.setGroupId(groupId);
        member.setUid(uid);
        return repo.save(member);
    }

    public List<StudyGroupMember> getMembersByGroupId(UUID groupId) {
        return repo.findByGroupId(groupId);
    }
}



//    public User updateUser (long id, User updatedUser){
//        return repo.save(updatedUser);
//    }
//
//    public void deleteUser(long id){
//        repo.deleteById(id);
//    }

