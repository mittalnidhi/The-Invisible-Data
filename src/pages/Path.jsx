
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Path.css";
import Navbar from "./Navbar";

import finalSil from "../assets/sinal sil.png";
import symp_cluster from "../assets/symp_cluster.png";
import experiences from "../assets/experiences.png";

const cards = [
  {
    title: "Symptom Atlas",
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
    title: "Slice of Life",
    back: "Read lived experience stories.",
    route: "/experiences",
    image: experiences,
  },
];

const offsets = [-1, 0, 1];

export default function Path() {
  const navigate = useNavigate();

  return (
    <main className="path">
      {/* SHARED NAVBAR */}
      <Navbar theme="light" />

      {/* PAGE CONTENT */}
      <section className="path__stage">
        <h1 className="path__title">
          <span className="path__titleMain">
            We meet you where you are at in your perimenopausal journey
          </span>

          <span className="path__titleSub">
            Choose your path
          </span>
        </h1>

        {/* INTERACTIVE CARDS */}
        <div className="path__cards">
          {cards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              className="pathCard"
              onClick={() => navigate(card.route)}
              style={{
                "--offset": offsets[index],
              }}
            >
              <span className="pathCard__inner">
                <span className="pathCard__face pathCard__front">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="pathCard__image"
                  />

                  <span className="pathCard__title">
                    {card.title}
                  </span>
                </span>

                <span className="pathCard__face pathCard__back">
                  {card.back}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
