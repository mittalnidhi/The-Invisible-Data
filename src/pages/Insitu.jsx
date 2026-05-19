import React, { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Insitu.css";

const carouselItems = [
  {
    title: "01",
    text: "Ever since I slipped into perimenopause, my sexual life got disrupted",
    audio: "/sounds/insitu-01.mp3",
  },
  {
    title: "02",
    text: "I loved drinking alocohol and coffee, but had to give up on both as it triggered anxiety & hot flashes respectively. To the point where my husband said he cannot deal with my anxiety issues anymore.. so I had to quit!",
    audio: "/sounds/insitu-02.mp3",
  },
  {
    title: "03",
    text: "Doom scrolling has triggered my depression and anxiety. It almost feels like that instagram knows what I am dealing with and it only shows me sob stuff now.",
    audio: "/sounds/insitu-03.mp3",
  },
  {
    title: "04",
    text: "My social circle has been of great support. I have learned so much about this stage from my friends and the communities they have suggested me to join.",
    audio: "/sounds/insitu-04.mp3",
  },
  {
    title: "05",
    text: "I have been in this stage for only a year now and it was too much to deal with. I am really scared about all the many perimenopausal years left to come.",
    audio: "/sounds/insitu-05.mp3",
  },
  {
    title: "06",
    text: "My husband and I shared a really good sexual bond. Now there is a strange silence between us that neither of us want to address.",
    audio: "/sounds/insitu-06.mp3",
  },
  {
    title: "07",
    text: "Why are there no work leaves and policies for perimenopause? The symptoms are not easy to deal with and having medical policies and leaves will be really helpful.",
    audio: "/sounds/insitu-07.mp3",
  },
  {
    title: "08",
    text: "I was dismissed by my doctor for 2 years when I was dealing with a dozen symptom. I finally changed my doctor now and paying out of my own pocket to get HRT because I cannot deal with it anymore.",
    audio: "/sounds/insitu-08.mp3",
  },
  {
    title: "09",
    text: "I had to fight with my doctor, change multiple doctors to finally get the treatment I needed.",
    audio: "/sounds/insitu-09.mp3",
  },
  {
    title: "10",
    text: "No one told me it was coming. I was not prepared for it. I was left trying to understand what was happening to my body. One day, you feel like you’re in your prime- and the next, you’re suddenly navigating symptoms you can’t explain.",
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
      <div id="timeout-warning">Are you still there? Redirecting home in 10 seconds...</div>
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

        <h1>Making meaning together</h1>

        <h2>
          The workshop enabled in-situ sensemaking, allowing participants to collectively interpret their
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
    </main>
  );
}