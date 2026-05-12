import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DearPeri.css";
import workshop1 from "../assets/workshop-1.jpg";

const sections = [
  {
    title: "Collective Data",
    statement: "Collective stories make invisible patterns visible.",
    subtext:
      "Explore shared perimenopause experiences gathered from digital communities.",
    route: "/collective-data",
    type: "data",
  },

  {
    title: "In situ Sense Making",
    statement: "Bodies make meaning through everyday life.",
    subtext:
      "Understand how symptoms are interpreted through relationships, identity, work, autonomy, body image, dismissal, sexual life, and medical costs.",
    route: "/insitu",
    type: "sense",
  },

  {
    title: "Workshop Photos",
    statement: "Care often begins through conversation.",
    subtext:
      "View visual traces from participatory workshops and collective reflection.",
    route: "/workshop-photos",
    type: "workshop",
  },

  {
    title: "Collect Your Own Data",
    statement: "Personal data can become body literacy.",
    subtext:
      "Begin mapping your own symptoms, triggers, patterns, and care journey.",
    route: "/personal-data",
    type: "collect",
  },
];

/* AUTO LOAD ALL WORKSHOP IMAGES */

const photoModules = import.meta.glob(
  "../assets/workshop-*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  }
);

const photos = Object.values(photoModules);

export default function DearPeri() {
  const [activePhoto, setActivePhoto] = useState(0);

  const prevPhoto = () => {
    setActivePhoto((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const nextPhoto = () => {
    setActivePhoto((prev) =>
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="dearPeri">
      {/* NAVBAR */}

      <nav className="nav">
        <button
          className="nav-button nav-title-button"
          onClick={() => (window.location.href = "/")}
        >
          INVISIBLE DATA
        </button>

        <div className="nav-right">
          <button
            className="nav-button"
            onClick={() => (window.location.href = "/about")}
          >
            ABOUT
          </button>

          <button
            className="nav-button"
            onClick={() => (window.location.href = "/path")}
          >
            PATH
          </button>

          <button
            className="nav-button"
            onClick={() => (window.location.href = "/dear-peri")}
          >
            DEAR PERI
          </button>
        </div>
      </nav>

      {/* HERO */}

      <section className="dearPeriHero">
        <h1>
          Dear Peri is a space
          <br />
          for lived data.
        </h1>

        <p>
          Collective stories, sense-making, workshop memories,
          and personal data reflections.
        </p>

        {/* LANDSCAPE PHOTO CAROUSEL */}

        <div className="dearPeriCarousel">
          <button
            className="carouselArrow"
            onClick={prevPhoto}
          >
            ←
          </button>

          <div className="carouselLandscape">
            {photos.length > 0 && (
              <img
                src={photos[activePhoto]}
                alt={`Workshop ${activePhoto + 1}`}
              />
            )}
          </div>

          <button
            className="carouselArrow"
            onClick={nextPhoto}
          >
            →
          </button>
        </div>

        <div className="scrollCue">
          <span>SCROLL</span>
          <i />
        </div>
      </section>

      {/* TIMELINE */}

      <section className="dearPeriTimeline">
        {sections.map((item, index) => (
          <article
            className="timelineRow"
            key={item.title}
          >
            {/* TOP CONNECTOR */}

            <div className="segmentTop">
              <div className="segmentDot" />
              <div className="segmentLine" />
              <div className="segmentDot" />
            </div>

            {/* CLICKABLE CIRCLE */}

            <Link
              to={item.route}
              className="timelineCircle"
            >
              <CircleAnimation type={item.type} />

              <span className="timelineCircleLabel">
                {item.title}
              </span>
            </Link>

            {/* TEXT */}

            <div className="timelineText">
              <h2>{item.statement}</h2>
              <p>{item.subtext}</p>
            </div>

            {/* BOTTOM CONNECTOR */}

            {index !== sections.length - 1 && (
              <div className="segmentBottom">
                <div className="segmentDot" />
                <div className="segmentLine" />
                <div className="segmentDot" />
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

/* -------------------------------- */
/* MAIN SWITCHER */
/* -------------------------------- */

function CircleAnimation({ type }) {
  if (type === "data") return <CollectiveDataArt />;
  if (type === "sense") return <SenseMakingArt />;
  if (type === "workshop") return <WorkshopArt />;
  return <CollectOwnDataArt />;
}

/* -------------------------------- */
/* COLLECTIVE DATA */
/* -------------------------------- */

function CollectiveDataArt() {
  const words = [
    "sleep",
    "food",
    "low libido",
    "triggers",
    "hot flashes",
    "brain fog",
    "weight gain",
    "infertility",
    "breast pain",
  ];

  return (
    <div className="circleArt circleArt--dataWords">
      <div className="dataGrid">
        {Array.from({ length: 45 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>

      <div className="dataBars">
        <b />
        <b />
        <b />
        <b />
        <b />
      </div>

      {words.map((word, i) => (
        <em
          key={word}
          className={`dataWord dataWord--${i + 1}`}
        >
          {word}
        </em>
      ))}
    </div>
  );
}

/* -------------------------------- */
/* IN SITU */
/* -------------------------------- */

function SenseMakingArt() {
  const words = [
    "relationship",
    "identity",
    "work",
    "autonomy",
    "body image",
    "dismissal",
    "sexual life",
    "medical costs",
  ];

  return (
    <div className="circleArt circleArt--senseImage">
      <img
        src="/arc-assets/insitu-women.png"
        alt="Women sitting around a table"
        className="senseWomenImage"
      />

      {words.map((word, i) => (
        <em
          key={word}
          className={`senseFloating senseFloating--${i + 1}`}
        >
          {word}
        </em>
      ))}
    </div>
  );
}

/* -------------------------------- */
/* WORKSHOP */
/* -------------------------------- */

function WorkshopArt() {
  return (
    <div className="circleArt circleArt--workshopNew">
      <div className="workshopBoard">
        <span>what</span>
        <span>does care</span>
        <span>look like?</span>
      </div>

      <div className="workshopSheet sheet--one">
        <span />
        <span />
        <span />
      </div>

      <div className="workshopSheet sheet--two">
        <span />
        <span />
      </div>

      <div className="stickyNote sticky--one">
        draw
      </div>

      <div className="stickyNote sticky--two">
        map
      </div>

      <div className="markerPen" />
      <div className="workshopHand" />
    </div>
  );
}

/* -------------------------------- */
/* PERSONAL DATA */
/* -------------------------------- */

function CollectOwnDataArt() {
  return (
    <div className="circleArt circleArt--collect">
      <div className="phone">
        <span />
        <span />
        <span />
      </div>

      <div className="phoneCircle" />

      <div className="collectRing ring1" />
      <div className="collectRing ring2" />
      <div className="collectRing ring3" />
    </div>
  );
}