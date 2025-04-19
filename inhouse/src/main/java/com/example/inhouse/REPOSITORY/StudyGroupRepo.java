package com.example.inhouse.REPOSITORY;

import com.example.inhouse.MODEL.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudyGroupRepo extends JpaRepository<StudyGroup, UUID> {

}

//When we just use repo.findAll() or repo.findById(id), those are built-in methods
//provided by JpaRepository.
//➡️ So we don’t need to declare them manually in the repository interface.


//to filter data using custom fields
//we need to declare them manually first in repo
//You still need to declare this method manually in your
//StudyGroupRepo, because:
//It's based on your own entity fields (year, branch)
//It’s not part of the built-in methods