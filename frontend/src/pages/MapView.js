import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles/MapViewPage.css";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { getSpots } from "../api/spots";

function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 17, { duration: 1.3 });
  }, [position, map]);
  return null;
}

function LocateButton({ onLocate }) {
  return (
    <button className="locate-btn-floating" onClick={onLocate} title="Use my location">
      📍
    </button>
  );
}

// Create a blue-dot icon like Google Maps
const blueDotIcon = L.divIcon({
  html: `<div class="blue-dot"></div>`,
  className: "",
  iconSize: [12, 12],
});

function MapView() {
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [openOnly, setOpenOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Red and gold icons
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  const goldIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    async function fetchSpots() {
      try {
        setLoading(true);
        const data = await getSpots();
        if (Array.isArray(data)) {
          const mapped = data.map((s) => {
            // Remove day of week from hours (e.g., "Sunday: 8am-8pm" -> "8am-8pm")
            const cleanHours = (s.hours || "").replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*/i, "");

            // Ensure rating is always a number
            const rating = typeof s.rating === 'number' ? s.rating : (s.rating != null ? Number(s.rating) : 0.0);
            const numRating = isNaN(rating) ? 0.0 : rating;

            return {
              id: s.id,
              name: s.name,
              type: s.type || "Study Spot",
              imageUrl: s.image,
              note: s.note || "",
              rating: numRating,
              hours: cleanHours,
              isOpen: s.isOpen === 1,
              latitude: s.position?.[0],
              longitude: s.position?.[1],
            };
          });
          setSpots(mapped);
        } else setError("Invalid data format from server.");
      } catch (err) {
        console.error(err);
        setError("Could not load study spots.");
      } finally {
        setLoading(false);
      }
    }
    fetchSpots();
  }, []);

  const filteredSpots = spots.filter((s) => {
    // Filter out spots with invalid coordinates
    if (s.latitude == null || s.longitude == null || isNaN(s.latitude) || isNaN(s.longitude)) {
      return false;
    }
    
    const t = searchTerm.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(t) ||
      s.type.toLowerCase().includes(t) ||
      s.note.toLowerCase().includes(t);
    const matchRating = (s.rating ?? 0) >= ratingFilter;
    const matchOpen = !openOnly || s.isOpen;
    return matchSearch && matchRating && matchOpen;
  });

  const handleLocate = () => {
    if (!navigator.geolocation)
      return alert("Geolocation not supported by your browser.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setFlyTo(coords);
      },
      () => alert("Unable to access your location.")
    );
  };

  if (loading)
    return (
      <div className="page">
        <NavBar />
        <div className="loading-screen">Loading map...</div>
      </div>
    );

  if (error)
    return (
      <div className="page">
        <NavBar />
        <div className="error-screen">{error}</div>
      </div>
    );

  return (
    <div className="page">
      <NavBar />

      <header className="header">
        <div className="location">
          <h2>Current Location</h2>
          <p>USC Campus</p>
        </div>

        <div className="filters">
          <input
            type="text"
            className="search"
            placeholder="🔍 Search for study spots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="rating-slider">
            <label htmlFor="ratingRange" className="slider-label">
              ⭐ {ratingFilter}+
            </label>
            <input
              id="ratingRange"
              type="range"
              min="0"
              max="5"
              step="1"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
            />
          </div>

          <label className="toggle-container">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
            />
            <span className="slider"></span>
            <span className="toggle-label">Open now</span>
          </label>
        </div>
      </header>

      <div className="main">
        <div className="list">
          <h3>Study Areas</h3>
          <p className="subtitle">{filteredSpots.length} spots nearby</p>

          {filteredSpots.length === 0 ? (
            <p className="no-results">No spots match your filters.</p>
          ) : (
            filteredSpots.map((s) => (
              <div
                key={s.id}
                className={`card ${selectedId === s.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedId(s.id);
                  setFlyTo([s.latitude, s.longitude]);
                }}
              >
                <img src={s.imageUrl} alt={s.name} className="thumb" />
                <div className="info">
                  <div className="title-row">
                    <h4>{s.name}</h4>
                    <span className={s.isOpen ? "badge open" : "badge closed"}>
                      {s.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  <p className="type">{s.type}</p>
                  <p className="note">{s.note}</p>
                  <p className="meta">
                    ⭐ {typeof s.rating === 'number' ? s.rating.toFixed(1) : '0.0'} • {s.hours?.split(",")[0]}
                  </p>
                  <button
                    className="open-details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/spots/${s.id}`);
                    }}
                  >
                    Open details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="map">
          <MapContainer
            center={[34.0205, -118.2856]}
            zoom={17}
            style={{ height: "100%", width: "100%", borderRadius: "16px" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flyTo && <FlyToMarker position={flyTo} />}

            {filteredSpots.map((s) => (
              <Marker
                key={s.id}
                position={[s.latitude, s.longitude]}
                icon={selectedId === s.id ? goldIcon : redIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedId(s.id);
                    setFlyTo([s.latitude, s.longitude]);
                  },
                }}
              >
                <Popup>
                  <strong>{s.name}</strong>
                  <br />
                  {s.isOpen ? "🟢 Open" : "🔴 Closed"} <br />
                  ⭐ {typeof s.rating === 'number' ? s.rating.toFixed(1) : '0.0'}
                </Popup>
              </Marker>
            ))}

            {userLocation && (
              <>
                <Marker position={userLocation} icon={blueDotIcon}>
                  <Popup>You are here 📍</Popup>
                </Marker>
                <Circle
                  center={userLocation}
                  radius={25}
                  pathOptions={{
                    color: "#007bff",
                    fillColor: "#007bff",
                    fillOpacity: 0.15,
                  }}
                />
              </>
            )}
          </MapContainer>
          <LocateButton onLocate={handleLocate} />
        </div>
      </div>
    </div>
  );
}

export default MapView;
