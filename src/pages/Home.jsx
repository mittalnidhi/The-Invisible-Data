import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="home-page">
      <div className="home-content">
        <p className="home-eyebrow">The Invisible Data</p>
        <h1 className="home-title">
          Explore the landscape of perimenopausal experiences
        </h1>
        <p className="home-subtitle">
          Choose a path to explore different forms of invisible data.
        </p>

        <div className="home-options">
          <button
            className="home-card"
            onClick={() => navigate("/cluster")}
          >
            <span className="card-number">01</span>
            <h2>Symptom Cluster</h2>
            <p>Explore symptom relationships, overlaps, and recurring patterns.</p>
          </button>

          <button
            className="home-card"
            onClick={() => navigate("/colony")}
          >
            <span className="card-number">02</span>
            <h2>Colony</h2>
            <p>View symptom experiences as a collective field of connected forms.</p>
          </button>

          <button
            className="home-card"
            onClick={() => navigate("/experiences")}
          >
            <span className="card-number">03</span>
            <h2>Experiences</h2>
            <p>Enter one experience space and see how the dataset gathers within it.</p>
          </button>
        </div>
      </div>
    </section>
  );
}