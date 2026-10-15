
import React from "react";
import { NavLink } from "react-router-dom";
import "./PersonalData.css";
import Navbar from "../pages/Navbar";

export default function PersonalData() {
  return (
    <main className="personalData">

      {/* Global Navbar */}
      <Navbar theme="dark" />

      {/* Secondary Navigation */}
      <section className="personalData__subnav">
        <NavLink to="/collective-data">
          Collective Data
        </NavLink>

        <NavLink to="/personal-data">
          Engage with your own data
        </NavLink>
      </section>

      {/* Introduction */}
      <section className="personalData__intro">
        <p>PERSONAL DATA</p>

        <h1>Engage with Your Own Data</h1>

        <h2>
          Use these guided activities to begin documenting your own
          perimenopause journey through symptoms, triggers, care experiences,
          daily impact, and patterns over time.
        </h2>
      </section>

      {/* Download Activities */}
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
