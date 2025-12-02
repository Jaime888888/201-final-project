import React from "react";
import "../styles/components.css";

function ProfilePage() {
  // Temporary placeholder until hooked to real auth/user API
  const user = {
    name: "Student Name",
    email: "you@usc.edu",
    classYear: "Class of 2027",
    major: "Major / Program",
  };

  const favorites = [
    { id: 1, name: "Leavey Library", distance: "0.2 mi", vibe: "Quiet · Late night" },
    { id: 2, name: "Village Study Lounge", distance: "0.5 mi", vibe: "Casual · Food nearby" },
    { id: 3, name: "Fertitta Courtyard", distance: "0.3 mi", vibe: "Outdoor · Natural light" },
  ];

  return (
    <div className="app">
      <div className="profile-card">
        <header className="profile-header">
          <div className="avatar-circle">
            {user.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <p>
              {user.major} · {user.classYear}
            </p>
          </div>
        </header>

        <section className="profile-section">
          <h2>Study preferences</h2>
          <div className="profile-tags">
            <span className="profile-tag">Quiet spaces</span>
            <span className="profile-tag">Outlets nearby</span>
            <span className="profile-tag">Open late</span>
          </div>
        </section>

        <section className="profile-section">
          <h2>Favorite spots</h2>
          <div className="favorites-list">
            {favorites.map((spot) => (
              <div key={spot.id} className="favorite-item">
                <div>
                  <h3>{spot.name}</h3>
                  <p className="favorite-meta">
                    {spot.distance} · {spot.vibe}
                  </p>
                </div>
                <button className="favorite-button">View</button>
              </div>
            ))}
          </div>
        </section>

        <footer className="profile-footer">
          <button className="secondary-button">Edit profile</button>
          <button className="danger-button">Log out</button>
        </footer>
      </div>
    </div>
  );
}

export default ProfilePage;
