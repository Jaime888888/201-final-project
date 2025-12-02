import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import "../styles/FavoritesPage.css";
import { getFavorites } from "../api/favorites";  // NEW

function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      setLoading(true);
      setError(null);
      try {
        const data = await getFavorites();   // use API helper
        if (isMounted) setFavorites(data);
      } catch (e) {
        if (isMounted) setError(e.message || "Failed to load favorites");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFavorites();
    return () => {
      isMounted = false;
    };
  }, []);



  const handleCardClick = (id) => {
    if (!id) return;
    navigate(`/spots/${id}`);
  };

  const renderImage = (spot) => {
    const photos = spot?.photos || spot?.images || [];
    const firstPhoto = Array.isArray(photos) ? photos[0] : null;
    const src = typeof firstPhoto === 'string' ? firstPhoto : firstPhoto?.url || null;
    if (!src) {
      return (
        <div className="fav-card__image fav-card__image--placeholder" aria-label="No image available" />
      );
    }
    return (
      <img className="fav-card__image" src={src} alt={`${spot?.name || 'Study Spot'} preview`} loading="lazy" />
    );
  };

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h1 className="favorites-title">Your Favorites</h1>

        {loading && (
          <div className="favorites-status">
            <div className="spinner" />
            <p>Loading favorites…</p>
          </div>
        )}

        {!loading && error && (
          <div className="favorites-status">
            <p className="error-text">{error}</p>
          </div>
        )}

        {!loading && !error && favorites.length === 0 && (
          <div className="favorites-empty">
            <h2>You haven’t added any favorites yet.</h2>
            <p>Browse study spots to add some!</p>
          </div>
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="favorites-grid">
            {favorites.map((spot) => (
              <button
                key={spot.id || spot._id}
                className="fav-card"
                onClick={() => handleCardClick(spot.id || spot._id)}
                aria-label={`Open ${spot?.name || 'Study Spot'} details`}
              >
                <div className="fav-card__media">
                  {renderImage(spot)}
                </div>
                <div className="fav-card__body">
                  <div className="fav-card__header">
                    <h3 className="fav-card__title">{spot?.name || 'Unnamed Spot'}</h3>
                    <div className="fav-card__rating">
                      <RatingStars rating={spot?.rating || spot?.averageRating || 0} />
                    </div>
                  </div>
                  {spot?.address && (
                    <p className="fav-card__address">{spot.address}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
