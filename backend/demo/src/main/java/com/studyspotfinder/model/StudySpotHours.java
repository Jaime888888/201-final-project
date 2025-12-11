package com.studyspotfinder.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "study_spot_hours")
public class StudySpotHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hours_id")
    private Long id;

    // Many hours entries belong to one StudySpot
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", nullable = false)
    private StudySpot studySpot;

    // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    @Column(name = "day_of_week", nullable = false)
    private int dayOfWeek;

    @Column(name = "open_time", nullable = false)
    private LocalTime openTime;

    @Column(name = "close_time", nullable = false)
    private LocalTime closeTime;

    public StudySpotHours() {}

    public StudySpotHours(StudySpot studySpot, int dayOfWeek, LocalTime openTime, LocalTime closeTime) {
        this.studySpot = studySpot;
        this.dayOfWeek = dayOfWeek;
        this.openTime = openTime;
        this.closeTime = closeTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StudySpot getStudySpot() { return studySpot; }
    public void setStudySpot(StudySpot studySpot) { this.studySpot = studySpot; }

    public int getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(int dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getOpenTime() { return openTime; }
    public void setOpenTime(LocalTime openTime) { this.openTime = openTime; }

    public LocalTime getCloseTime() { return closeTime; }
    public void setCloseTime(LocalTime closeTime) { this.closeTime = closeTime; }
}
