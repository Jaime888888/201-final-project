package com.studyspotfinder.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.studyspotfinder.model.Review;
import com.studyspotfinder.model.StudySpot;
import com.studyspotfinder.model.User;
import com.studyspotfinder.repository.ReviewRepository;
import com.studyspotfinder.repository.StudySpotRepository;
import com.studyspotfinder.security.AuthTokenUserResolver;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final StudySpotRepository studySpotRepository;
    private final AuthTokenUserResolver authTokenUserResolver;

    public ReviewController(ReviewRepository reviewRepository,
                            StudySpotRepository studySpotRepository,
                            AuthTokenUserResolver authTokenUserResolver) {
        this.reviewRepository = reviewRepository;
        this.studySpotRepository = studySpotRepository;
        this.authTokenUserResolver = authTokenUserResolver;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<Void> submitReview(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                             @RequestBody ReviewRequest request) {
        // Resolve authenticated user from JWT
        Optional<User> userOpt = authTokenUserResolver.resolveUser(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        User user = userOpt.get();

        // Validate rating
        Integer rating = request.getRatingAsInteger();
        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().build();
        }

        // Validate spot
        Optional<StudySpot> spotOpt = studySpotRepository.findById(request.getSpotId());
        if (spotOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        StudySpot spot = spotOpt.get();

        // Save review (simple create; not deduping)
        Review review = new Review(user, spot, rating, request.getComment());
        reviewRepository.save(review);

        // Just 200 OK to show we updated it
        return ResponseEntity.ok().build();
    }

    // DTO to accept {"spotId":"7","rating":"4"} (rating may be string or number)
    public static class ReviewRequest {
        private Long spotId;
        private Object rating; // accept string or number
        private String comment; // optional

        public Long getSpotId() { return spotId; }
        public void setSpotId(Long spotId) { this.spotId = spotId; }

        public Object getRating() { return rating; }
        public void setRating(Object rating) { this.rating = rating; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }

        public Integer getRatingAsInteger() {
            if (rating == null) return null;
            if (rating instanceof Number) {
                return ((Number) rating).intValue();
            }
            try {
                return Integer.parseInt(rating.toString());
            } catch (NumberFormatException e) {
                return null;
            }
        }
    }
}