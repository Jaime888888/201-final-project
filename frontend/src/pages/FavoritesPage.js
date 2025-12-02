import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import NavBar from '../components/NavBar';
import '../styles/FavoritesPage.css';
import { AuthContext } from '../context/AuthContext';

function FavoritesPage() {
  const { token } = useContext(AuthContext); // token
  
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Temporary hardcoded favorites (REMOVE WHEN BACKEND READY)
  const demoFavorites = [
    {
      id: 'demo-1',
      name: 'Leavey Library',
      address: '651 W 35th St, Los Angeles, CA',
      rating: 4.7,
      distance: '150 m',
      photos: [
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=60'
      ],
    },
    {
      id: 'demo-2',
      name: 'Café 84',
      address: '1025 W 34th St, Los Angeles, CA',
      rating: 4.2,
      distance: '400 m',
      photos: [
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=60'
      ],
    },
    {
      id: 'demo-3',
      name: 'Annenberg Commons',
      address: '3630 Watt Way, Los Angeles, CA',
      rating: 3.9,
      distance: '600 m',
      photos: [
        'https://images.unsplash.com/photo-1556484687-30636164638b?auto=format&fit=crop&w=800&q=60'
      ],
    },
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadFavorites() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/favorites', {
          headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` // attach token 
          },
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to fetch favorites (${res.status})`);
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // Fallback to demo data when response is not JSON
          if (isMounted) {
            setFavorites(demoFavorites);
            setError(null);
          }
        } else {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data?.favorites || []);
          if (isMounted) setFavorites(items);
        }
      } catch (e) {
        // Fallback to demo data on error
        if (isMounted) {
          setFavorites(demoFavorites);
          setError(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFavorites();
    return () => { isMounted = false; };
  }, [token]);

  const handleCardClick = (id) => {
    if (!id) return;
    navigate(`/spots/${id}`);
  };

  const handleRemoveFavorite = (id, evt) => {
    if (evt) evt.stopPropagation();
    if (!id) return;
    setFavorites(prev => prev.filter(f => (f.id || f._id) !== id));
  };

  const renderImage = (spot) => {
    const photos = spot?.photos || spot?.images || [];
    const firstPhoto = Array.isArray(photos) ? photos[0] : null;
    const src = typeof firstPhoto === 'string' ? firstPhoto : firstPhoto?.url || null;
    if (!src) return <div className="thumb thumb--placeholder" aria-label="No image available" />;
    return <img className="thumb" src={src} alt={`${spot?.name || 'Study Spot'} preview`} loading="lazy" />;
  };

  const list = favorites;

  return (
    <div className="page favorites-page">
      <NavBar />
      <div className="main">
        <div className="list">
          <div className="list-header">
            <h3>Your Favorites</h3>
            {!loading && (
              <p className="subtitle">{list.length} saved spots</p>
            )}
          </div>

          {loading && (
            <div className="favorites-status">
              <div className="spinner" />
              <p>Loading favorites…</p>
            </div>
          )}

          {!loading && list.length > 0 && (
            <div>
              {list.map((spot) => (
                <div
                  key={spot.id || spot._id}
                  className="card"
                  onClick={() => handleCardClick(spot.id || spot._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(spot.id || spot._id); }}
                  aria-label={`Open ${spot?.name || 'Study Spot'} details`}
                >
                  <button
                    className="remove-fav-btn"
                    aria-label="Remove favorite"
                    onClick={(e) => handleRemoveFavorite(spot.id || spot._id, e)}
                  >
                    ×
                  </button>
                  {renderImage(spot)}
                  <div className="info">
                    <div className="title-row">
                      <h4>{spot?.name || 'Unnamed Spot'}</h4>
                    </div>
                    {spot?.address && <p className="type">{spot.address}</p>}
                    <p className="meta">⭐ {(spot?.rating || spot?.averageRating || 0).toFixed ? (spot?.rating || spot?.averageRating || 0).toFixed(1) : (spot?.rating || spot?.averageRating || 0)}
                      {spot?.distance ? ` • ${spot.distance}` : ''}
                    </p>
                    <div className="fav-stars"><RatingStars rating={spot?.rating || spot?.averageRating || 0} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className="favorites-empty">
              <h2>You haven’t added any favorites yet.</h2>
              <p>Browse study spots to add some!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;
