import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FavoritesPage from '../pages/FavoritesPage';
import MapView from "../pages/MapView";
import LoginPage from '../pages/LoginPage';
import AddSpotPage from '../pages/AddSpotPage';
import StudySpotDetailsPage from '../pages/StudySpotDetailsPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/mapview" element={<MapView />} />
        <Route path="/spots/:id" element={<StudySpotDetailsPage />} />
        {/* Additional routes can be added here */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add-spot" element={<AddSpotPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
