import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingJourney from "./pages/LandingJourney";
import About from "./pages/About";
import Path from "./pages/Path";
import DearPeri from "./pages/DearPeri";

import CollectiveData from "./pages/CollectiveData";
import Insitu from "./pages/Insitu";
import WorkshopPhotos from "./pages/WorkshopPhotos";
import PersonalData from "./pages/PersonalData";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MAIN PAGES */}

        <Route path="/" element={<LandingJourney />} />
        <Route path="/about" element={<About />} />
        <Route path="/path" element={<Path />} />
        <Route path="/dear-peri" element={<DearPeri />} />

        {/* DEAR PERI SUBPAGES */}

        <Route
          path="/collective-data"
          element={<CollectiveData />}
        />

        <Route
          path="/insitu"
          element={<Insitu />}
        />

        <Route
          path="/workshop-photos"
          element={<WorkshopPhotos />}
        />

        <Route
          path="/personal-data"
          element={<PersonalData />}
        />
      </Routes>
    </BrowserRouter>
  );
}