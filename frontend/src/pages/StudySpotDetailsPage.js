import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/StudySpotDetailsPage.css";

function StudySpotDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSpot() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://studyspot.online/api/spots/${id}`, {
          credentials: "include"
        });
        if (!res.ok) {
          throw new Error("Failed to fetch spot");
        }
        const data = await res.json();
        if (isMounted) {
          setSpot(data);
        }
      } catch {
        if (isMounted) {
          setSpot({
            id,
            name: `Study spot ${id}`,
            address: "Location not available",
            description: "Description not available.",
            imageUrl: null
          });
          setError("Live data not available, showing placeholder information.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadSpot();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleToggleFavorite = async () => {
    const next = !favorite;
    setFavorite(next);
    try {
      await fetch("https://studyspot.online/api/favorites", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ spotId: Number(id) })
      });
    } catch {}
  };

  // Helper function to format time
  const formatTime = (time) => {
    if (!time) return "Not specified";
    // If time is in HH:MM format, convert to 12-hour format
    if (time.includes(":")) {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    return time;
  };

  // Helper to render stars
  const renderStars = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="details-rating-stars">
        {Array(fullStars).fill(0).map((_, i) => (
          <span key={i} className="star-full">★</span>
        ))}
        {hasHalfStar && <span className="star-half">★</span>}
        {Array(emptyStars).fill(0).map((_, i) => (
          <span key={i} className="star-empty">☆</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="details-page">
        <NavBar />
        <main className="details-main">
          <div className="details-loading">Loading study spot...</div>
        </main>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="details-page">
        <NavBar />
        <main className="details-main">
          <div className="details-error">
            Could not load this study spot.
            <button
              type="button"
              className="details-back-button"
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Get image URL - check multiple possible field names
  const imageUrl = spot.imageUrl || spot.image || spot.images?.[0] || null;
  const rating = spot.rating || spot.averageRating || null;
  const buildingType = spot.buildingType || spot.type || null;
  const openHours = spot.openHours || spot.openTime || null;
  const closeHours = spot.closeHours || spot.closeTime || null;
  const isOpen = spot.isOpen !== undefined ? spot.isOpen : (spot.isOpenNow !== undefined ? spot.isOpenNow : null);

  return (
    <div className="details-page">
      <NavBar />
      <main className="details-main">
        <div className="details-header-row">
          <button
            type="button"
            className="details-back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button
            type="button"
            className={`details-favorite-button ${
              favorite ? "active" : ""
            }`}
            onClick={handleToggleFavorite}
          >
            {favorite ? "★ In favorites" : "☆ Add to favorites"}
          </button>
        </div>

        <section className="details-layout">
          <div className="details-primary">
            {/* Image section */}
            {imageUrl && (
              <div className="details-image-container">
                <img 
                  src={imageUrl} 
                  alt={spot.name} 
                  className="details-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="details-title-block">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.5rem" }}>
                <h1 style={{ margin: 0 }}>{spot.name}</h1>
                {isOpen !== null && (
                  <span className={`details-status-badge ${isOpen ? "status-open" : "status-closed"}`}>
                    {isOpen ? "🟢 Open Now" : "🔴 Closed"}
                  </span>
                )}
              </div>
              <p className="details-address">{spot.address}</p>
            </div>

            {/* Info tags row - always show */}
            <div className="details-tags-row">
              {rating ? (
                <span className="details-pill pill-on">
                  ⭐ {rating.toFixed ? rating.toFixed(1) : rating} Rating
                </span>
              ) : (
                <span className="details-pill pill-off">
                  ⭐ No rating yet
                </span>
              )}
              {buildingType ? (
                <span className="details-pill pill-on">
                  {buildingType}
                </span>
              ) : (
                <span className="details-pill pill-off">
                  Building type not specified
                </span>
              )}
              {(openHours || closeHours) ? (
                <span className="details-pill pill-on">
                  🕐 {formatTime(openHours)} - {formatTime(closeHours)}
                </span>
              ) : (
                <span className="details-pill pill-off">
                  🕐 Hours not specified
                </span>
              )}
            </div>

            {/* Rating section - always show */}
            <div className="details-rating-section">
              <h2>Rating</h2>
              {rating ? (
                <div className="details-rating-display">
                  {renderStars(rating)}
                  <div className="details-rating-value">
                    <span className="rating-number">{rating.toFixed ? rating.toFixed(1) : rating}</span>
                    <span className="rating-max">/ 5.0</span>
                  </div>
                </div>
              ) : (
                <p className="details-no-rating">No ratings yet. Be the first to rate this spot!</p>
              )}
            </div>

            <div className="details-section">
              <h2>Overview</h2>
              <p className="details-description">
                {spot.description && spot.description.trim().length > 0
                  ? spot.description
                  : "No description has been added for this spot yet."}
              </p>
            </div>

            <div className="details-section">
              <h2>Tips for studying here</h2>
              <ul className="details-tips-list">
                <li>Arrive a little early to grab your preferred seat.</li>
                <li>Bring headphones in case the space gets noisy.</li>
                <li>Check Wi-Fi and outlets when you arrive so you can settle in quickly.</li>
              </ul>
            </div>
          </div>

          <aside className="details-side">
            {/* Status card - always show */}
            {isOpen !== null && (
              <div className="details-card">
                <h3>Status</h3>
                <p className="details-side-text" style={{ 
                  color: isOpen ? "#047857" : "#dc2626",
                  fontWeight: 600 
                }}>
                  {isOpen ? "🟢 Open Now" : "🔴 Closed"}
                </p>
              </div>
            )}

            <div className="details-card">
              <h3>Location</h3>
              <p className="details-side-text">
                {spot.address || "Address not available."}
              </p>
            </div>

            {/* Building Type - always show */}
            <div className="details-card">
              <h3>Building Type</h3>
              <p className="details-side-text">
                {buildingType || "Not specified"}
              </p>
            </div>

            {/* Hours - always show */}
            <div className="details-card">
              <h3>Hours</h3>
              <p className="details-side-text">
                {(openHours || closeHours) 
                  ? `${formatTime(openHours)} - ${formatTime(closeHours)}`
                  : "Not specified"}
              </p>
            </div>

            {/* Rating - always show */}
            <div className="details-card">
              <h3>Rating</h3>
              <p className="details-side-text">
                {rating 
                  ? `⭐ ${rating.toFixed ? rating.toFixed(1) : rating} / 5.0`
                  : "No ratings yet"}
              </p>
            </div>

            <div className="details-card">
              <h3>Quick info</h3>
              <p className="details-side-text">
                Ideal for focused solo work or small group sessions within a short distance of campus.
              </p>
              <p className="details-side-meta">
                Bring a charger and water bottle so you can stay for a full study block.
              </p>
            </div>
          </aside>
        </section>

        {error && (
          <div className="details-warning">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudySpotDetailsPage;
