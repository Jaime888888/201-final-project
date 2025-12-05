import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    // TODO: replace with real logout (clear auth, tokens, etc.)
    // Navigate to Login page (home page)
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand" onClick={() => navigate('/mapview')} role="button" tabIndex={0}>
          StudySpot
        </div>
        <div className="navbar__links">
          <NavLink
            to="/mapview"
            className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}
          >
            MapView
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}
          >
            Favorites
          </NavLink>
          <NavLink
            to="/add-spot"
            className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}
          >
            Add Spot
          </NavLink>
          <button className="navlink navlink--button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
