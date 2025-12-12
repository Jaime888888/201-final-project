package com.studyspotfinder.controller;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyspotfinder.model.StudySpot;
import com.studyspotfinder.model.StudySpotHours;
import com.studyspotfinder.repository.ReviewRepository;
import com.studyspotfinder.repository.StudySpotRepository;

@RestController
@RequestMapping("/api/spots")
@CrossOrigin(origins = "*")
public class StudySpotController {

    private final StudySpotRepository studySpotRepository;
    private final ReviewRepository reviewRepository;

    public StudySpotController(StudySpotRepository studySpotRepository, ReviewRepository reviewRepository) {
        this.studySpotRepository = studySpotRepository;
        this.reviewRepository = reviewRepository;
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping
    public List<StudySpotResponse> getAllSpots() {
        List<StudySpot> spots = studySpotRepository.findAll();
        return spots.stream().map(s -> {
            Double avgRating = reviewRepository.findAverageRatingBySpotId(s.getId());
            return StudySpotResponse.fromEntity(s, avgRating);
        }).collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<StudySpotResponse> getSpotById(@PathVariable Long id) {
        return studySpotRepository.findById(id)
                .map(s -> {
                    Double avgRating = reviewRepository.findAverageRatingBySpotId(s.getId());
                    return ResponseEntity.ok(StudySpotResponse.fromEntity(s, avgRating));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<?> createSpot(@RequestBody CreateSpotRequest request) {
        try {
            // Validate required fields
            if (request.name == null || request.name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            }
            if (request.address == null || request.address.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Address is required"));
            }

            // Create StudySpot entity
            StudySpot spot = new StudySpot();
            spot.setName(request.name.trim());
            spot.setType(request.type != null ? request.type.trim() : null);
            spot.setAddress(request.address.trim());
            spot.setDescription(request.description != null ? request.description.trim() : null);
            spot.setNote(request.note != null ? request.note.trim() : null);
            spot.setLatitude(request.latitude);
            spot.setLongitude(request.longitude);
            spot.setImageUrl(request.imageUrl != null ? request.imageUrl.trim() : null);

            // Initialize hours list
            spot.setHours(new ArrayList<>());

            // Save the spot first to get an ID
            spot = studySpotRepository.save(spot);

            // Create and save hours entries if provided
            if (request.hours != null && !request.hours.isEmpty()) {
                for (CreateSpotRequest.HourEntry hourEntry : request.hours) {
                    // Validate hour entry
                    if (hourEntry.dayOfWeek < 0 || hourEntry.dayOfWeek > 6) {
                        return ResponseEntity.badRequest().body(Map.of("error", "dayOfWeek must be between 0 (Sunday) and 6 (Saturday)"));
                    }
                    if (hourEntry.openTime == null || hourEntry.closeTime == null) {
                        return ResponseEntity.badRequest().body(Map.of("error", "openTime and closeTime are required for each hour entry"));
                    }

                    try {
                        LocalTime openTime = LocalTime.parse(hourEntry.openTime);
                        LocalTime closeTime = LocalTime.parse(hourEntry.closeTime);

                        StudySpotHours hours = new StudySpotHours(spot, hourEntry.dayOfWeek, openTime, closeTime);
                        spot.getHours().add(hours);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid time format. Use HH:mm or HH:mm:ss (e.g., 09:00, 17:30)"));
                    }
                }
                // Save the spot again to persist the hours (cascade will handle it)
                spot = studySpotRepository.save(spot);
            }

            // Return the created spot
            Double avgRating = reviewRepository.findAverageRatingBySpotId(spot.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(StudySpotResponse.fromEntity(spot, avgRating));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create spot: " + e.getMessage()));
        }
    }

    public static class StudySpotResponse {
        public Long id;
        public String name;
        public String type;
        public String hours;
        public int isOpen;
        public Double rating;
        public String note;
        public double[] position;
        public String image;

        public static StudySpotResponse fromEntity(StudySpot s, Double avgRating) {
            StudySpotResponse r = new StudySpotResponse();
            r.id = s.getId();
            r.name = s.getName();
            r.type = s.getType();
            r.hours = s.getHoursFormatted();
            r.isOpen = s.getIsOpen();
            r.rating = avgRating != null ? avgRating : 0.0;
            r.note = s.getNote();
            r.position = s.getPosition();
            r.image = s.getImage();
            return r;
        }
    }

    public static class CreateSpotRequest {
        public String name;
        public String type;
        public String address;
        public String description;
        public String note;
        public Double latitude;
        public Double longitude;
        public String imageUrl;
        public List<HourEntry> hours;

        public static class HourEntry {
            public int dayOfWeek; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            public String openTime; // Format: "HH:mm" or "HH:mm:ss" (e.g., "09:00", "17:30")
            public String closeTime; // Format: "HH:mm" or "HH:mm:ss" (e.g., "09:00", "17:30")
        }
    }
}