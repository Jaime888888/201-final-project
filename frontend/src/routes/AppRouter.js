import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FavoritesPage from '../pages/FavoritesPage';
// Optionally import other pages and NavBar if available
// import HomePage from '../pages/HomePage';
// import StudySpotDetailsPage from '../pages/StudySpotDetailsPage';
// import NotFoundPage from '../pages/NotFoundPage';
// import NavBar from '../components/NavBar';

function AppRouter() {
  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/favorites" element={<FavoritesPage />} />
        {/* <Route path="/spots/:id" element={<StudySpotDetailsPage />} /> */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
