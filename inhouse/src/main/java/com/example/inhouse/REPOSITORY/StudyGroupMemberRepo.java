package com.example.inhouse.REPOSITORY;

import com.example.inhouse.MODEL.StudyGroup;
import com.example.inhouse.MODEL.StudyGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudyGroupMemberRepo extends JpaRepository<StudyGroupMember,Long> {

   List<StudyGroupMember> findByGroupId(UUID groupId);
}
