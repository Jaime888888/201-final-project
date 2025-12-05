package com.studyspotfinder.controller;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyspotfinder.model.Review;
import com.studyspotfinder.model.StudySpot;
import com.studyspotfinder.model.User;
import com.studyspotfinder.repository.ReviewRepository;
import com.studyspotfinder.repository.StudySpotRepository;
import com.studyspotfinder.security.AuthTokenUserResolver;

@RestController
@RequestMapping("/api")
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

    /**
     * POST /api/spots/{spotId}/reviews
     */
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/spots/{spotId}/reviews")
    public ResponseEntity<?> submitReview(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                          @PathVariable Long spotId,
                                          @RequestBody ReviewRequest request) {
        Optional<User> userOpt = authTokenUserResolver.resolveUser(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        User user = userOpt.get();

        Integer rating = request.getRatingAsInteger();
        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().build();
        }

        Optional<StudySpot> spotOpt = studySpotRepository.findById(spotId);
        if (spotOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        StudySpot spot = spotOpt.get();

        Review review = new Review(user, spot, rating, request.getComment());
        Review saved = reviewRepository.save(review);

        return ResponseEntity.ok(toResponse(saved));
    }

    /**
     * GET /api/spots/{spotId}/reviews
     */
    @GetMapping("/spots/{spotId}/reviews")
    public ResponseEntity<List<ReviewResponse>> listReviews(@PathVariable Long spotId) {
        if (!studySpotRepository.existsById(spotId)) {
            return ResponseEntity.notFound().build();
        }

        List<Review> reviews = reviewRepository.findByStudySpotIdOrderByCreatedAtDesc(spotId);
        List<ReviewResponse> body = reviews.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(body);
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt() != null ? review.getCreatedAt().atOffset(ZoneOffset.UTC) : null,
                review.getUser() != null
                        ? new UserSummary(review.getUser().getId(), review.getUser().getUsername())
                        : null);
    }

    // DTO to accept {"rating":"4", "comment": "..."} (rating may be string or number)
    public static class ReviewRequest {
        private Object rating; // accept string or number
        private String comment; // optional

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

    public static class ReviewResponse {
        private Long id;
        private Integer rating;
        private String comment;
        private Object createdAt;
        private UserSummary user;

        public ReviewResponse(Long id, Integer rating, String comment, Object createdAt, UserSummary user) {
            this.id = id;
            this.rating = rating;
            this.comment = comment;
            this.createdAt = createdAt;
            this.user = user;
        }

        public Long getId() { return id; }
        public Integer getRating() { return rating; }
        public String getComment() { return comment; }
        public Object getCreatedAt() { return createdAt; }
        public UserSummary getUser() { return user; }
    }

    public static class UserSummary {
        private Long id;
        private String username;

        public UserSummary(Long id, String username) {
            this.id = id;
            this.username = username;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
    }
}