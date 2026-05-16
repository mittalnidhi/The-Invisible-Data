import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./DearPeri.css";
import workshop1 from "../assets/workshop-1.jpg";


const sections = [
  {
    title: "Collective Data",
    statement: "Collective stories make invisible patterns visible.",
    subtext:
      "Explore shared perimenopause experiences gathered from participatory workshop (click).",
    route: "/collective-data",
    type: "data",
  },

  {
    title: "In situ Sense Making",
    statement: "Bodies make meaning through everyday life.",
    subtext:
      "Understand how symptoms are interpreted through relationships, identity, work, autonomy, body image, dismissal, sexual life, and medical costs (click).",
    route: "/insitu",
    type: "sense",
  },

  {
    title: "Collect Your Own Data",
    statement: "Personal data can become body literacy.",
    subtext:
      "Begin mapping your own symptoms, triggers, patterns, and care journey (click).",
    route: "/personal-data",
    type: "collect",
  },

];

/* auto load all workshop images */

const photoModules = import.meta.glob(
  "../assets/workshop-*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default",
  }
);

const photos = Object.values(photoModules);

export default function DearPeri() {
  const navigate = useNavigate();
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
      {/* navbar */}

      <nav className="nav">
        <button
          className="nav-button nav-title-button"
          onClick={() => navigate("/")}
        >
          INVISIBLE DATA
        </button>

        <div className="nav-right">
          <button
            className="nav-button"
            onClick={() => navigate("/about")}
          >
            ABOUT
          </button>

          <button
            className="nav-button"
            onClick={() => navigate("/path")}
          >
            PATH
          </button>

          <button className="nav-button nav-button--active">
            DEAR PERI
          </button>
        </div>
      </nav>

      {/* hero */}

      <section className="dearPeriHero">
        <h1>
          Dear Peri is a space
          <br />
          for lived data
        </h1>

        <p>
          Collective stories, sense-making, workshop memories,
          and personal data reflections.
        </p>

        {/* landscape photo carousel */}

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

        
      </section>

      {/* timeline */}

      <section className="dearPeriTimeline">
        {sections.map((item, index) => (
          <article
            className="timelineRow"
            key={item.title}
          >
            

            {/* clickable carousel */}

            <Link
              to={item.route}
              className="timelineCircle"
            >
              <CircleAnimation type={item.type} />

              <span className="timelineCircleLabel">
                {item.title}
              </span>
            </Link>
             <div className="timelineDivider" />


            {/* text */}

            <div className="timelineText">
              <h2>{item.statement}</h2>
              <p>{item.subtext}</p>
            </div>

            
          </article>
        ))}
      </section>
    </main>
  );
}

/* main switcher */


function CircleAnimation({ type }) {
  if (type === "data") return <CollectiveDataArt />;
  if (type === "sense") return <SenseMakingArt />;
  if (type === "workshop") return <WorkshopArt />;
  return <CollectOwnDataArt />;
}


/* collective data */


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


/* in-situ part */


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


/* workshop */


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

/* personal data */


function CollectOwnDataArt() {
  const words = [
    "food",
    "triggers",
    "avoid",
    "include",
    "mapping",
    "pattern",
    "community",
    "care team",
    "my journey",
    "data",
  ];

  return (
    <div className="circleArt circleArt--collectNew">
      <div className="paper paper--one">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="paper paper--two">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="paper paper--three">
        <span />
        <span />
        <span />
      </div>

      <div className="penMain">
        <span />
      </div>

      {words.map((word, i) => (
        <em key={word} className={`collectWord collectWord--${i + 1}`}>
          {word}
        </em>
      ))}
    </div>
  );
}