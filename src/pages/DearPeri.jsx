import React from "react";
import { Link } from "react-router-dom";
import "./DearPeri.css";

const sections = [
  {
    title: "Collective Data",
    statement: "Collective stories make invisible patterns visible.",
    subtext:
      "Explore shared perimenopause experiences gathered from digital communities.",
    middleText: "From shared stories, patterns begin to surface.",
    route: "/collective-data",
    type: "data",
  },
  {
    title: "In situ Sense Making",
    statement: "Bodies make meaning through everyday life.",
    subtext:
      "Understand how symptoms are interpreted through food, sleep, work, care, and daily routines.",
    middleText: "Meaning forms in the small details of everyday life.",
    route: "/sense-making",
    type: "sense",
  },
  {
    title: "Workshop Photos",
    statement: "Care often begins through conversation.",
    subtext:
      "View visual traces from participatory workshops and collective reflection.",
    middleText: "Conversation becomes a way to see what is often unseen.",
    route: "/workshop-photos",
    type: "workshop",
  },
  {
    title: "Collect Your Own Data",
    statement: "Personal data can become body literacy.",
    subtext:
      "Begin mapping your own symptoms, triggers, patterns, and care journey.",
    middleText: "Your body holds patterns worth noticing.",
    route: "/collect-your-own-data",
    type: "collect",
  },
];

export default function DearPeri() {
  return (
    <main className="dearPeri">
      <nav className="dearPeriNav">
        <Link to="/" className="dearPeriNav__brand">
          THE INVISIBLE DATA
        </Link>

        <div className="dearPeriNav__links">
          <Link to="/about">ABOUT</Link>
          <Link to="/path">PATH</Link>
          <Link to="/dear-peri">DEAR PERI</Link>
        </div>
      </nav>

      <section className="dearPeriHero">
        <h1>
          Dear Peri is a space
          <br />
          for lived data.
        </h1>

        <p>
          Collective stories, sense-making, workshop memories, and personal data
          reflections.
        </p>

        <div className="scrollHint">SCROLL</div>
      </section>

      <section className="dearPeriJourney">
        {sections.map((item, index) => (
          <article className="journeySection" key={item.title}>
            <div className="timelineConnector">
              <div className="timelineDot" />
              <div className="timelineLine timelineLine--top" />
            </div>

            <div className="journeyText">
              <h2>{item.statement}</h2>
              <p>{item.subtext}</p>
            </div>

            <Link
              to={item.route}
              className="journeyCircle"
              aria-label={`Open ${item.title}`}
            >
              <CircleAnimation type={item.type} />
              <span>{item.title}</span>
            </Link>

            {index !== sections.length - 1 && (
              <>
                <div className="journeyMiddleText">{item.middleText}</div>

                <div className="timelineConnector timelineConnector--bottom">
                  <div className="timelineLine timelineLine--bottom" />
                  <div className="timelineDot timelineDot--bottom" />
                </div>
              </>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

function CircleAnimation({ type }) {
  if (type === "data") {
    return (
      <div className="circleArt circleArt--data">
        <i>hot flashes</i>
        <i>sleep</i>
        <i>brain fog</i>
        <i>mood</i>
        <b />
        <b />
        <b />
      </div>
    );
  }

  if (type === "sense") {
    return (
      <div className="circleArt circleArt--sense">
        <div className="bodyIcon" />
        <em>food</em>
        <em>sleep</em>
        <em>work</em>
        <em>care</em>
      </div>
    );
  }

  if (type === "workshop") {
    return (
      <div className="circleArt circleArt--workshop">
        <div className="paper paper--one" />
        <div className="paper paper--two" />
        <div className="pen" />
      </div>
    );
  }

  return (
    <div className="circleArt circleArt--collect">
      <div className="phoneIcon">
        <span />
        <span />
        <span />
      </div>
      <div className="ring ring--one" />
      <div className="ring ring--two" />
    </div>
  );
}