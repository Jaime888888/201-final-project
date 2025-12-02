package com.studyspotfinder.repository;

import com.studyspotfinder.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    // custom finders can be added later
}