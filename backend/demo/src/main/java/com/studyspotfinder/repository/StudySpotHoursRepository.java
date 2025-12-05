package com.studyspotfinder.repository;

import com.studyspotfinder.model.StudySpotHours;
import com.studyspotfinder.model.StudySpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudySpotHoursRepository extends JpaRepository<StudySpotHours, Long> {

    // Get all hours for a specific spot
    List<StudySpotHours> findByStudySpot(StudySpot spot);

    // Get hours for a spot on a specific day (0–6)
    List<StudySpotHours> findByStudySpotAndDayOfWeek(StudySpot spot, int dayOfWeek);

    // Optional useful method: get all hours for a spot ordered by day/time
    List<StudySpotHours> findByStudySpotOrderByDayOfWeekAscOpenTimeAsc(StudySpot spot);
}
