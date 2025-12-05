package com.studyspotfinder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(name = "uk_favorite_user_spot", columnNames = {"user_id", "spot_id"})
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id", nullable = false)
    private StudySpot studySpot;

    public Favorite() {}

    public Favorite(User user, StudySpot studySpot) {
        this.user = user;
        this.studySpot = studySpot;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public StudySpot getStudySpot() { return studySpot; }
    public void setStudySpot(StudySpot studySpot) { this.studySpot = studySpot; }
}