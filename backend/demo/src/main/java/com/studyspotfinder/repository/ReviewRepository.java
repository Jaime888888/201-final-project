package com.studyspotfinder.repository;

import com.studyspotfinder.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // custom finders can be added later
}