package com.studyspotfinder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.studyspotfinder.model.Favorite;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @Query("select f from Favorite f where f.user.id = :userId and f.studySpot.id = :spotId")
    Optional<Favorite> findByUserIdAndStudySpotId(Long userId, Long spotId);

    @Query("select f from Favorite f join fetch f.studySpot where f.user.id = :userId")
    List<Favorite> findByUserId(Long userId);
}