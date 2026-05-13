import React, { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Insitu.css";

const carouselItems = [
  {
    title: "01",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    audio: "/sounds/insitu-01.mp3",
  },
  {
    title: "02",
    text: "Suspendisse varius enim in eros elementum tristique.",
    audio: "/sounds/insitu-02.mp3",
  },
  {
    title: "03",
    text: "Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    audio: "/sounds/insitu-03.mp3",
  },
  {
    title: "04",
    text: "Ut commodo diam libero vitae erat.",
    audio: "/sounds/insitu-04.mp3",
  },
  {
    title: "05",
    text: "Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet.",
    audio: "/sounds/insitu-05.mp3",
  },
  {
    title: "06",
    text: "Nunc ut sem vitae risus tristique posuere.",
    audio: "/sounds/insitu-06.mp3",
  },
  {
    title: "07",
    text: "Praesent commodo cursus magna vel scelerisque nisl consectetur.",
    audio: "/sounds/insitu-07.mp3",
  },
  {
    title: "08",
    text: "Donec ullamcorper nulla non metus auctor fringilla.",
    audio: "/sounds/insitu-08.mp3",
  },
  {
    title: "09",
    text: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
    audio: "/sounds/insitu-09.mp3",
  },
  {
    title: "10",
    text: "Maecenas faucibus mollis interdum.",
    audio: "/sounds/insitu-10.mp3",
  },
];

export default function Insitu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const audioRef = useRef(null);

  const activeItem = carouselItems[activeIndex];

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    if (audioRef.current) audioRef.current.pause();
  };

  const goPrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
    if (audioRef.current) audioRef.current.pause();
  };

  const playSound = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

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
        <NavLink to="/personal-data">Engage with your own data</NavLink>
      </section>

      <section className="insitu__intro">
        <p>IN-SITU SENSEMAKING</p>

        <h1>Making meaning together through visual reflection.</h1>

        <h2>
          The workshop enabled participants to collectively interpret their
          perimenopausal experiences, transforming symptoms, healthcare journeys,
          emotional shifts, and daily disruptions into visible patterns and
          shared narratives.
        </h2>
      </section>

      <section className="insituCarousel">
        <button className="insituArrow insituArrow--left" onClick={goPrev}>
          ←
        </button>

        <div className="insituCircle">
          <div className="insituCircle__inner">
            <h3>{activeItem.title}</h3>

            <p>{activeItem.text}</p>

            <button className="insituSoundButton" onClick={playSound}>
              PLAY SOUND
            </button>

            <audio ref={audioRef} src={activeItem.audio} />
          </div>
        </div>

        <button className="insituArrow insituArrow--right" onClick={goNext}>
          →
        </button>
      </section>

      <section className="insituCarouselDots">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={activeIndex === index ? "active" : ""}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </section>

      <section className="insitu__statement">
        <p>
          The discussions enabled in-situ sensemaking, allowing themes,
          experiences, and patterns to emerge organically through collective
          reflection.
        </p>
      </section>
    </main>
  );
}