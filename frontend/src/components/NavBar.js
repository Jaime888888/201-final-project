import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    // TODO: replace with real logout (clear auth, tokens, etc.)
    // Navigate to Login page
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
          StudySpot
        </div>
        <div className="navbar__links">
          <NavLink
            to="/"
            className={({ isActive }) => `navlink ${isActive && location.pathname === '/' ? 'active' : ''}`}
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
