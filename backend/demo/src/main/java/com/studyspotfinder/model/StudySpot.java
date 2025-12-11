package com.studyspotfinder.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "study_spots")
public class StudySpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spot_id")
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    // Optional: type/category (e.g., Library, Cafe)
    @Column(name = "type", length = 255)
    private String type;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Optional: note shown in UI
    @Column(columnDefinition = "TEXT")
    private String note;

    // Position as lat/lng
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    // Image URL
    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @OneToMany(mappedBy = "studySpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<StudySpotHours> hours;

    public StudySpot() {}

    public StudySpot(String name, String address, String description) {
        this.name = name;
        this.address = address;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<StudySpotHours> getHours() { return hours; }
    public void setHours(List<StudySpotHours> hours) { this.hours = hours; }

    // ---- Business helpers ----/ge

    public boolean isOpenNow() {
        ZoneId zoneId = ZoneId.of("America/Los_Angeles");
        LocalDateTime localNow = LocalDateTime.now(zoneId);
        LocalTime timeNow = localNow.toLocalTime();
        int today = localNow.getDayOfWeek().getValue() % 7; // Monday=1..Sunday=7 → 0..6

        if (hours == null || hours.isEmpty()) return false;

        for (StudySpotHours h : hours) {
            int dow = h.getDayOfWeek();
            LocalTime open = h.getOpenTime();
            LocalTime close = h.getCloseTime();

            // Normal same-day hours, e.g., 09:00–17:00
            if (dow == today && !timeNow.isBefore(open) && timeNow.isBefore(close)) {
                return true;
            }

            // Overnight hours (single row): e.g., 22:00 → 02:00
            if (dow == today) {
                if (close.isBefore(open)) { // crosses midnight
                    if (!timeNow.isBefore(open) || timeNow.isBefore(close)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Expose isOpen as 0/1 for frontend
    @Transient
    public int getIsOpen() {
        return isOpenNow() ? 1 : 0;
    }

    // Format hours into single string: "monday: 9am-5pm, tuesday: ..."
    @Transient
    public String getHoursFormatted() {
        if (hours == null || hours.isEmpty()) return "";

        Map<Integer, String> dayNames = Map.of(
                0, "sunday", 1, "monday", 2, "tuesday", 3, "wednesday",
                4, "thursday", 5, "friday", 6, "saturday"
        );

        StringBuilder sb = new StringBuilder();
        // Group by day-of-week and concatenate time ranges
        for (int dow = 0; dow <= 6; dow++) {
            String day = dayNames.get(dow);
            StringBuilder ranges = new StringBuilder();
            for (StudySpotHours h : hours) {
                if (h.getDayOfWeek() == dow) {
                    String open = toAmPm(h.getOpenTime());
                    String close = toAmPm(h.getCloseTime());
                    if (ranges.length() > 0) ranges.append(", ");
                    ranges.append(open).append("-").append(close);
                }
            }
            if (ranges.length() > 0) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(day).append(": ").append(ranges);
            }
        }
        return sb.toString();
    }

    // Position as [lat, lng]
    @Transient
    public double[] getPosition() {
        if (latitude == null || longitude == null) return new double[0];
        return new double[] { latitude, longitude };
    }

    @Transient
    public String getImage() {
        return imageUrl;
    }

    // Utility: 24h -> 12h am/pm
    private String toAmPm(LocalTime t) {
        int hour = t.getHour();
        int minute = t.getMinute();
        String ampm = hour >= 12 ? "pm" : "am";
        int hr12 = hour % 12;
        if (hr12 == 0) hr12 = 12;
        if (minute == 0) {
            return hr12 + ampm;
        }
        return hr12 + ":" + String.format("%02d", minute) + ampm;
    }
}