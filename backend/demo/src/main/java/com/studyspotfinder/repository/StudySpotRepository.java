package com.studyspotfinder.repository;

import com.studyspotfinder.model.StudySpot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudySpotRepository extends JpaRepository<StudySpot, Long> {
    // add custom queries if needed later
}