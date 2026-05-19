import React from "react";
import { useNavigate } from "react-router-dom";
import "./Path.css";
import finalSil from "../assets/sinal sil.png";
import symp_cluster from "../assets/symp_cluster.png";
import experiences from "../assets/experiences.png";

export default function Path() {
  const navigate = useNavigate();

  const cardsVisible = 1;

  const cards = [
    {
      title: "Colony of Symptoms",
      back: "Represents a wide range of symptoms observed in this phase",
      route: "/colony",
      image: finalSil,
    },
    {
      title: "Symptom Cluster",
      back: "Perimenopausal Symptoms appear in clusters rather than in isolation.",
      route: "/cluster",
      image: symp_cluster,
    },
    {
      title: "Slices of Life",
      back: "Read lived experience stories.",
      route: "/experiences",
      image: experiences,
    },
  ];

  return (
    <main className="path">
      <div id="timeout-warning">Are you still there? Redirecting home in 10 seconds...</div>
      <nav className="nav">
        <button
          className="nav-button nav-title-button"
          onClick={() => navigate("/")}
        >
          INVISIBLE DATA
        </button>

        <div className="nav-right">
          <button className="nav-button" onClick={() => navigate("/about")}>
            ABOUT
          </button>

          <button className="nav-button nav-button--active">
            PATH
          </button>

          <button className="nav-button" onClick={() => navigate("/dear-peri")}>
            DEAR PERI
          </button>
        </div>
      </nav>

      <section className="path__stage">
        <h1 className="path__title">
          <span className="path__titleMain">
            We meet you where you are at your journey
          </span>
          <br />
          <span className="path__titleSub">Choose your path</span>
        </h1>

        <div
          className="path__cards"
          style={{
            opacity: cardsVisible,
          }}
        >
          {cards.map((card, index) => {
            const offsets = [-300, 0, 300];

            return (
              <button
                key={card.title}
                className="pathCard"
                onClick={() => navigate(card.route)}
                style={{
                  transform: `translate(${offsets[index]}px, 0px) scale(1)`,
                }}
              >
                <span className="pathCard__inner">
                  <span className="pathCard__face pathCard__front">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="pathCard__image"
                    />
                    <span className="pathCard__title">{card.title}</span>
                  </span>

                  <span className="pathCard__face pathCard__back">
                    {card.back}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}