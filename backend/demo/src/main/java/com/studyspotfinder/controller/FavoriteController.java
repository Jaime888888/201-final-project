package com.studyspotfinder.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.studyspotfinder.model.Favorite;
import com.studyspotfinder.model.StudySpot;
import com.studyspotfinder.model.User;
import com.studyspotfinder.repository.FavoriteRepository;
import com.studyspotfinder.repository.ReviewRepository;
import com.studyspotfinder.repository.StudySpotRepository;
import com.studyspotfinder.security.AuthTokenUserResolver;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final StudySpotRepository studySpotRepository;
    private final AuthTokenUserResolver authTokenUserResolver;
    private final ReviewRepository reviewRepository;

    public FavoriteController(FavoriteRepository favoriteRepository,
                              StudySpotRepository studySpotRepository,
                              AuthTokenUserResolver authTokenUserResolver,
                              ReviewRepository reviewRepository) {
        this.favoriteRepository = favoriteRepository;
        this.studySpotRepository = studySpotRepository;
        this.authTokenUserResolver = authTokenUserResolver;
        this.reviewRepository = reviewRepository;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<Void> setFavorite(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                            @RequestBody FavoriteRequest request) {
        Optional<User> userOpt = authTokenUserResolver.resolveUser(authHeader);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        User user = userOpt.get();

        if (request.getSpotId() == null || request.getFavorite() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<StudySpot> spotOpt = studySpotRepository.findById(request.getSpotId());
        if (spotOpt.isEmpty()) return ResponseEntity.notFound().build();
        StudySpot spot = spotOpt.get();

        Optional<Favorite> existing = favoriteRepository.findByUserIdAndStudySpotId(user.getId(), spot.getId());

        if (request.getFavorite()) {
            // create if not exists
            if (existing.isEmpty()) {
                favoriteRepository.save(new Favorite(user, spot));
            }
        } else {
            // remove if exists
            existing.ifPresent(favoriteRepository::delete);
        }

        return ResponseEntity.ok().build();
    }

    // Authenticated GET: returns user's favorite spots in the same format as /api/spots
    @PreAuthorize("hasRole('USER')")
    @GetMapping
    public ResponseEntity<List<StudySpotController.StudySpotResponse>> getMyFavorites(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Optional<User> userOpt = authTokenUserResolver.resolveUser(authHeader);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();
        User user = userOpt.get();

        // Requires FavoriteRepository.findByUserId(Long userId)
        List<Favorite> favorites = favoriteRepository.findByUserId(user.getId());

        List<StudySpotController.StudySpotResponse> result = favorites.stream()
                .map(Favorite::getStudySpot)
                .map(s -> {
                    Double avgRating = reviewRepository.findAverageRatingBySpotId(s.getId());
                    return StudySpotController.StudySpotResponse.fromEntity(s, avgRating);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    public static class FavoriteRequest {
        private Long spotId;
        private Boolean favorite;

        public Long getSpotId() { return spotId; }
        public void setSpotId(Long spotId) { this.spotId = spotId; }

        public Boolean getFavorite() { return favorite; }
        public void setFavorite(Boolean favorite) { this.favorite = favorite; }
    }
}