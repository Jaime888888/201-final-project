import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "../styles/MapViewPage.css";
import NavBar from '../components/NavBar';


// ✅ Default Leaflet icon fix
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🧭 Helper to move map view when a spot is selected
function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 18, { duration: 1.3 }); // Smooth zoom-in
    }
  }, [position, map]);
  return null;
}

function MapView() {
  const [selectedId, setSelectedId] = useState(null);
  const [flyTo, setFlyTo] = useState(null);

  const studySpots = [
    {
      id: 1,
      name: "Leavey Library",
      type: "Library",
      status: "Open",
      rating: 4.7,
      distance: "150 m",
      note: "Quiet and well-lit study zones",
      position: [34.0211, -118.2826],
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      name: "Café 84",
      type: "Coffee House",
      status: "Open",
      rating: 4.2,
      distance: "400 m",
      note: "Great coffee, can get crowded midday",
      position: [34.0206, -118.2853],
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      name: "Annenberg Commons",
      type: "Study Lounge",
      status: "Closed",
      rating: 3.9,
      distance: "600 m",
      note: "Spacious and modern group space",
      position: [34.0229, -118.2869],
      image:
        "https://images.unsplash.com/photo-1556484687-30636164638b?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 4,
      name: "USC Village Starbucks",
      type: "Coffee Shop",
      status: "Open",
      rating: 4.5,
      distance: "900 m",
      note: "Busy but perfect for long study sessions",
      position: [34.0266, -118.2854],
      image:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=60",
    },
  ];

  // Get selected spot coordinates
  const selectedSpot = studySpots.find((s) => s.id === selectedId);

  return (
    <div className="page">
      <NavBar />
      {/* Header */}
      <header className="header">
        <div className="location">
          <h2>Current Location</h2>
          <p>USC Campus</p>
        </div>
        <input
          type="text"
          className="search"
          placeholder="🔍 Search for study spots..."
        />
      </header>

      {/* Split View */}
      <div className="main">
        {/* Left: List */}
        <div className="list">
          <h3>Study Areas</h3>
          <p className="subtitle">{studySpots.length} spots nearby</p>

          {studySpots.map((spot) => (
            <div
              key={spot.id}
              className={`card ${selectedId === spot.id ? "active" : ""}`}
              onClick={() => {
                setSelectedId(spot.id);
                setFlyTo(spot.position);
              }}
            >
              <img src={spot.image} alt={spot.name} className="thumb" />
              <div className="info">
                <div className="title-row">
                  <h4>{spot.name}</h4>
                  <span
                    className={
                      spot.status === "Open" ? "badge open" : "badge closed"
                    }
                  >
                    {spot.status}
                  </span>
                </div>
                <p className="type">{spot.type}</p>
                <p className="note">{spot.note}</p>
                <p className="meta">
                  ⭐ {spot.rating} • {spot.distance}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Map */}
        <div className="map">
          <MapContainer
            center={[34.0205, -118.2856]} // 🎯 USC center
            zoom={17}
            style={{ height: "100%", width: "100%", borderRadius: "16px" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flyTo && <FlyToMarker position={flyTo} />}
            {studySpots.map((spot) => (
              <Marker
                key={spot.id}
                position={spot.position}
                eventHandlers={{
                  click: () => {
                    setSelectedId(spot.id);
                    setFlyTo(spot.position);
                  },
                }}
              >
                <Popup>
                  <strong>{spot.name}</strong>
                  <br />
                  {spot.status === "Open" ? "🟢 Open" : "🔴 Closed"} <br />
                  ⭐ {spot.rating} • {spot.distance}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default MapView;

