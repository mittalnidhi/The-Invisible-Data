import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingJourney from "./pages/LandingJourney";


import About from "./pages/About";
import Path from "./pages/Path";
import DearPeri from "./pages/DearPeri";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingJourney />} />
        
       
        <Route path="/about" element={<About />} />
        <Route path="/path" element={<Path/>} />
        <Route path="/dear-peri" element={<DearPeri />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}