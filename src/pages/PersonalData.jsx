import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./PersonalData.css";

export default function PersonalData() {
  return (
    <main className="personalData">
      <div id="timeout-warning">
        Are you still there? Redirecting home in 10 seconds...
      </div>

      <nav className="nav">
        <Link to="/" className="nav__brand">
          INVISIBLE DATA
        </Link>

        <div className="nav__links">
          <Link to="/about">ABOUT</Link>
          <Link to="/path">PATH</Link>
          <Link to="/dearperi">DEAR PERI</Link>
        </div>
      </nav>

      <section className="personalData__subnav">
        <NavLink to="/collective-data">Collective Data</NavLink>
        <NavLink to="/insitu">Sense Making</NavLink>
        <NavLink to="/personal-data">Engage with your own data</NavLink>
      </section>

      <section className="personalData__intro">
        <p>PERSONAL DATA</p>

        <h1>Engage with Your Own Data</h1>

        <h2>
          Use these guided activities to begin documenting your own
          perimenopause journey through symptoms, triggers, care experiences,
          daily impact, and patterns over time.
        </h2>
      </section>

      <section className="downloadActivities">
        
        <a
          href="/arc-assets/dear-peri-activities.pdf"
          download
          className="downloadActivities__button"
        >
          Download Activities PDF
        </a>
      </section>
    </main>
  );
}