import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./PersonalData.css";

const activities = [
  {
    title: "Timeline of Perimenopause",
    short: "Track when symptoms started and how long they continued.",
    image: "/arc-assets/timeline.png",
    details:
      "Use this activity to visually mark when you first noticed changes in your body, mood, cycle, sleep, or daily energy.",
  },
  {
    title: "Symptom Landscape",
    short: "Map symptoms using color, shape, intensity, and frequency.",
    image: "/arc-assets/symptom-landscape.png",
    details:
      "Choose shapes, colors, and marks for different symptoms. Build a visual landscape of your experience.",
  },
  {
    title: "Worst Symptom Marker",
    short: "Identify the symptom that disrupts daily life the most.",
    image: "/arc-assets/worst-symptom.png",
    details:
      "Highlight the symptom that feels most intense, persistent, or disruptive.",
  },
  {
    title: "Trigger Mapping",
    short: "Record food, caffeine, alcohol, sleep, stress, or lifestyle triggers.",
    image: "/arc-assets/trigger-mapping.png",
    details:
      "Track what worsens your symptoms, including caffeine, sugar, alcohol, poor sleep, stress, or workload.",
  },
  {
    title: "Relief Mapping",
    short: "Note what helps: rest, treatment, medication, movement, or care.",
    image: "/arc-assets/relief-mapping.png",
    details:
      "Document what brings relief, including HRT, supplements, therapy, movement, rest, food changes, or support.",
  },
  {
    title: "Healthcare Journey",
    short: "Track doctor visits, dismissal, diagnosis, and treatment trials.",
    image: "/arc-assets/healthcare-journey.png",
    details:
      "Record care experiences, including when you felt heard, dismissed, confused, supported, or left without answers.",
  },
  {
    title: "Daily Impact Map",
    short: "Show how symptoms affect work, relationships, sleep, and identity.",
    image: "/arc-assets/daily-impact.png",
    details:
      "Map how symptoms move through everyday life: work, family, intimacy, social life, confidence, and rest.",
  },
  {
    title: "Pattern Reflection",
    short: "Connect repeated symptoms, triggers, and coping strategies.",
    image: "/arc-assets/pattern-reflection.png",
    details:
      "Reflect on recurring patterns between symptoms, triggers, relief strategies, timing, and emotional shifts.",
  },
];

export default function PersonalData() {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const visibleCards = activities.slice(startIndex, startIndex + 3);

  const goNext = () => {
    setStartIndex((prev) => (prev + 3 >= activities.length ? 0 : prev + 1));
  };

  const goPrev = () => {
    setStartIndex((prev) => (prev === 0 ? activities.length - 3 : prev - 1));
  };

  return (
    <main className="personalData">
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

        <h1>Engage with your own data</h1>

        <h2>
          Choose an activity to begin documenting your own perimenopause journey
          through symptoms, triggers, care experiences, daily impact, and
          patterns over time.
        </h2>
      </section>

      <section className="activityCarousel">
        <button className="activityArrow" onClick={goPrev}>
          ←
        </button>

        <div className="activityCards">
          {visibleCards.map((activity, index) => (
            <button
              className="activityCard"
              key={activity.title}
              onClick={() => setSelectedActivity(activity)}
            >
              <span className="activityCard__number">
                0{startIndex + index + 1}
              </span>

              <div className="activityCard__image">
                {activity.image ? (
                  <img src={activity.image} alt={activity.title} />
                ) : (
                  <span>ADD IMAGE</span>
                )}
              </div>

              <h3>{activity.title}</h3>

              <p>{activity.short}</p>

              <span className="activityCard__cta">OPEN ACTIVITY</span>
            </button>
          ))}
        </div>

        <button className="activityArrow" onClick={goNext}>
          →
        </button>
      </section>

      {selectedActivity && (
        <section className="activityModal">
          <div
            className="activityModal__backdrop"
            onClick={() => setSelectedActivity(null)}
          />

          <div className="activityModal__box">
            <button
              className="activityModal__close"
              onClick={() => setSelectedActivity(null)}
            >
              ×
            </button>

            <p>ACTIVITY</p>

            <h2>{selectedActivity.title}</h2>

            <h3>{selectedActivity.short}</h3>

            <div className="activityModal__line" />

            <h4>How to use this activity</h4>

            <p className="activityModal__details">
              {selectedActivity.details}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}