package com.studyspotfinder.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyspotfinder.model.StudySpot;
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
}