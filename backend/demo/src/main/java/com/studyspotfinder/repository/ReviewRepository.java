package com.studyspotfinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.studyspotfinder.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("select avg(r.rating) from Review r where r.studySpot.id = :spotId")
    Double findAverageRatingBySpotId(Long spotId);

    List<Review> findByStudySpotIdOrderByCreatedAtDesc(Long spotId);
}