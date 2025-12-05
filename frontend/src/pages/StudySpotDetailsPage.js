import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/StudySpotDetailsPage.css";
import { getReviews, createReview } from "../api/reviews";
import { getFavorites, toggleFavorite } from "../api/favorites";
import { getSpotById } from "../api/spots";

function StudySpotDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSpot() {
      setLoading(true);
      setError("");
      try {
        // Use API helper which already handles auth/URL
        const data = await getSpotById(id);
        // Normalize to the shape MapView expects
        const normalized = {
          id: data.id ?? data._id,
          name: data.name,
          type: data.type || data.buildingType || "Study Spot",
          imageUrl: data.image || data.imageUrl || (Array.isArray(data.images) ? data.images[0] : null),
          note: data.note || data.description || "",
          rating: data.rating ?? data.averageRating ?? 0,
          hours: data.hours || data.openHours || "",
          isOpen: data.isOpen === 1 || data.isOpen === true || data.isOpenNow === true,
          latitude: Array.isArray(data.position) ? data.position[0] : data.lat ?? null,
          longitude: Array.isArray(data.position) ? data.position[1] : data.lng ?? null,
          address: data.address || data.location || null,
          raw: data,
        };
        if (isMounted) setSpot(normalized);
      } catch (e) {
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
      } 

      try {
        const favs = await getFavorites();
        if (isMounted) {
          const isFav = favs.some(f => (f.id || f._id) == id);
          setFavorite(isFav);
        }
      } catch (favErr) {
        console.error("Failed to load favorites:", favErr);
      }
      
      finally {
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

  // Load reviews for this spot
  useEffect(() => {
    let mounted = true;
    async function loadReviews() {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const data = await getReviews(id);
        const list = Array.isArray(data) ? data : (data?.reviews || []);
        if (mounted) setReviews(list);
      } catch (err) {
        if (mounted) setReviewsError(err.message || "Failed to load reviews");
      } finally {
        if (mounted) setReviewsLoading(false);
      }
    }
    if (id) loadReviews();
    return () => { mounted = false; };
  }, [id]);

  const handleToggleFavorite = async () => {
    const next = !favorite;
    setFavorite(next);
    // try {
    //   await fetch("https://studyspot.online/api/favorites", {
    //     method: next ? "POST" : "DELETE",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    //     body: JSON.stringify({ spotId: Number(id) })
    //   });
    // } catch {}
    try {
      await toggleFavorite(Number(id), next);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setFavorite(!next); // rollback
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (submittingReview) return;
    setSubmittingReview(true);
    setReviewsError(null);
    try {
      const payload = {
        rating: Number(newReview.rating),
        comment: newReview.comment ? newReview.comment.trim() : ""
      };
      const created = await createReview(id, payload);
      if (created) {
        setReviews(prev => [created, ...prev]);
      } else {
        const fresh = await getReviews(id);
        setReviews(Array.isArray(fresh) ? fresh : (fresh?.reviews || []));
      }
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      setReviewsError(err.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
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

  // Map API fields to UI variables (handle multiple possible names)
  const imageUrl = spot.image || spot.imageUrl || (Array.isArray(spot.images) ? spot.images[0] : null) || null;
  const rating = spot.rating ?? spot.averageRating ?? null;
  const buildingType = spot.type || spot.buildingType || null;
  // The API returns a freeform hours string in `hours` per example; prefer that first
  const hoursText = spot.hours || spot.openHours || spot.hoursText || null;
  // If API provides open/close times separately, try to use them (openTime/closeTime)
  const openTime = spot.openTime || spot.open || null;
  const closeTime = spot.closeTime || spot.close || null;
  // isOpen may be returned as 0/1 or boolean
  const isOpen = spot.isOpen !== undefined ? (spot.isOpen === 1 || spot.isOpen === true) : (spot.isOpenNow !== undefined ? !!spot.isOpenNow : null);
  const note = spot.note || spot.description || null;
  const position = Array.isArray(spot.position) ? spot.position : (spot.lat && spot.lng ? [spot.lat, spot.lng] : null);

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
            {imageUrl ? (
              <div className="details-image-container">
                <img
                  src={imageUrl}
                  alt={spot.name}
                  className="details-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="details-image-placeholder">No image available</div>
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
              <p className="details-address">{spot.address || (position ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}` : "Address not available.")}</p>
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
              {hoursText ? (
                // Match MapView: show the first comma-separated segment of the hours string
                <span className="details-pill pill-on">🕐 {String(hoursText).split(",")[0]}</span>
              ) : (openTime || closeTime) ? (
                <span className="details-pill pill-on">🕐 {formatTime(openTime)} - {formatTime(closeTime)}</span>
              ) : (
                <span className="details-pill pill-off">🕐 Hours not specified</span>
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
                {note && note.trim().length > 0 ? note : "No description has been added for this spot yet."}
              </p>
            </div>

            {/* Reviews section */}
            <div className="details-section">
              <h2>Reviews</h2>

              {reviewsLoading ? (
                <p>Loading reviews…</p>
              ) : (
                <>
                  {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to leave one!</p>
                  ) : (
                    <ul className="details-reviews-list">
                      {reviews.map((r, idx) => (
                        <li key={r.id || r._id || idx} className="details-review-item">
                          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <strong>{r.user?.username || r.username || "Anonymous"}</strong>
                            <span>⭐ {r.rating != null ? (r.rating.toFixed ? r.rating.toFixed(1) : r.rating) : "-"}</span>
                          </div>
                          {r.comment && <p style={{ marginTop: "0.25rem" }}>{r.comment}</p>}
                          <div className="details-review-meta">
                            <small>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              <form className="details-review-form" onSubmit={handleSubmitReview} style={{ marginTop: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.25rem" }}>
                  Rating:
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </label>

                <label style={{ display: "block", marginTop: "0.5rem" }}>
                  Comment:
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                    style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
                    placeholder="Share a short tip about this spot..."
                  />
                </label>

                <div style={{ marginTop: "0.5rem" }}>
                  <button type="submit" disabled={submittingReview}>
                    {submittingReview ? "Submitting…" : "Submit review"}
                  </button>
                  {reviewsError && <div style={{ color: "crimson", marginTop: "0.5rem" }}>{reviewsError}</div>}
                </div>
              </form>
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
                {hoursText ? String(hoursText).split(",")[0] : (openTime || closeTime) ? `${formatTime(openTime)} - ${formatTime(closeTime)}` : "Not specified"}
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