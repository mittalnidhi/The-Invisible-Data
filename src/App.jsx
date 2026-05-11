import { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingJourney from "./pages/LandingJourney";
import About from "./pages/About";
import Path from "./pages/Path";
import DearPeri from "./pages/DearPeri";

import CollectiveData from "./pages/CollectiveData";
import Insitu from "./pages/Insitu";
import WorkshopPhotos from "./pages/WorkshopPhotos";
import PersonalData from "./pages/PersonalData";
import Experience from "./components/Experience";
import Cluster from "./components/Cluster";
import Colony from "./components/Colony";
import storyData from "./data/experiences_dummy.json";

export default function App() {
  const [data, setData] = useState(() => {
    const saved = sessionStorage.getItem("app_story_data");
    return saved ? JSON.parse(saved) : storyData;
  });
  useEffect(() => {
    sessionStorage.setItem("app_story_data", JSON.stringify(data));
  }, [data]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingJourney />} />
        <Route path="/cluster" element={<Cluster />} />
        <Route path="/colony" element={<Colony />} />
        <Route path="/experiences" element={<Experience storyData={data} setStoryData={setData}/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
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
