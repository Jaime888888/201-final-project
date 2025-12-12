import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './NavBar.css';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuestUser, logout } = useContext(AuthContext);

  const onLogout = () => {
    logout();
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
          {!isGuestUser && (
            <>
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
            </>
          )}
          <button className="navlink navlink--button" onClick={onLogout}>
            {isGuestUser ? "Login" : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
