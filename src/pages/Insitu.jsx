import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Insitu.css";



export default function Insitu() {
  return (
    <main className="insitu">
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

      <section className="insitu__subnav">
        <NavLink to="/collective-data">Collective Data</NavLink>
        <NavLink to="/insitu">Sense Making</NavLink>
        <NavLink to="/personal-data">
          Engage with your own data
        </NavLink>
      </section>

      <section className="insitu__intro">
        <p>IN-SITU SENSEMAKING</p>

        <h1>
          Making meaning together through visual reflection.
        </h1>

        <h2>
          The workshop enabled participants to collectively interpret
          their perimenopausal experiences, transforming symptoms,
          healthcare journeys, emotional shifts, and daily disruptions
          into visible patterns and shared narratives.
        </h2>
      </section>

      

      <section className="insitu__statement">
        <p>
          The discussions enabled in-situ sensemaking,
          allowing themes, experiences, and patterns
          to emerge organically through collective reflection.
        </p>
      </section>
    </main>
  );
}