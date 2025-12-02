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
        const res = await fetch(`/api/spots/${id}`, {
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
            hasWifi: false,
            hasOutlets: false
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
      await fetch("/api/favorites", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ spotId: Number(id) })
      });
    } catch {}
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

  const hasWifi = Boolean(spot.hasWifi);
  const hasOutlets = Boolean(spot.hasOutlets);

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
            <div className="details-title-block">
              <h1>{spot.name}</h1>
              <p className="details-address">{spot.address}</p>
            </div>

            <div className="details-tags-row">
              <span
                className={`details-pill ${
                  hasWifi ? "pill-on" : "pill-off"
                }`}
              >
                {hasWifi ? "Wi-Fi available" : "Wi-Fi not listed"}
              </span>
              <span
                className={`details-pill ${
                  hasOutlets ? "pill-on" : "pill-off"
                }`}
              >
                {hasOutlets ? "Outlets available" : "Outlets not listed"}
              </span>
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
            <div className="details-card">
              <h3>Location</h3>
              <p className="details-side-text">
                {spot.address || "Address not available."}
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

        <section className="details-section reviews-section">
          <div className="details-reviews-header">
            <h2>Reviews</h2>
            <span className="details-reviews-subtitle">
              Reviews integration can be added here using your reviews table.
            </span>
          </div>
          <div className="details-review-placeholder">
            No reviews are shown yet. Once the backend endpoint for reviews is ready,
            this section can list recent comments and ratings from other students.
          </div>
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
