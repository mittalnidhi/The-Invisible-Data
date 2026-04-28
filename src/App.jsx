import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingJourney from "./pages/LandingJourney";
import Home from "./pages/Home";
import Experience from "./components/Experience";
import Cluster from "./components/Cluster";
import Colony from "./components/Colony";
import storyData from "./data/experiences_dummy.json";
import About from "./pages/About";
import Path from "./pages/Path";
import DearPeri from "./pages/DearPeri";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingJourney />} />
        <Route path="/home" element={<Home />} />
         <Route path="/cluster" element={<Cluster />} />
        <Route path="/colony" element={<Colony />} />
        <Route path="/experiences" element={<Experience storyData={storyData}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/path" element={<Path/>} />
        <Route path="/dear-peri" element={<DearPeri />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}