import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Path.css";
import finalSil from "../assets/sinal sil.png";
import symp_cluster from "../assets/symp_cluster.png";
import experiences from "../assets/experiences.png";


export default function Path() {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState({ x: -9999, y: -9999 });
  const [scrollP, setScrollP] = useState(0);

  const particles = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      ch: i % 2 === 0 ? "0" : "1",
      left: 8 + Math.random() * 84,
      top: 10 + Math.random() * 78,
      size: 9 + Math.random() * 8,
      opacity: 0.08 + Math.random() * 0.12,
      flyX: -90 + Math.random() * 180,
      flyY: -90 + Math.random() * 180,
    }));
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      setCursor({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);

    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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

          <button
            className="nav-button"
            onClick={() => navigate("/dear-peri")}
          >
            DEAR PERI
          </button>
        </div>
      </nav>

      <section className="path__stage">
        <div className="path__glitchField" aria-hidden="true">
          {particles.map((p) => {
            const px =
              typeof window !== "undefined"
                ? (p.left / 100) * window.innerWidth
                : 0;

            const py =
              typeof window !== "undefined"
                ? (p.top / 100) * window.innerHeight
                : 0;

            const dx = cursor.x - px;
            const dy = cursor.y - py;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const active = dist < 90;
            const strength = active ? 1 - dist / 90 : 0;

            return (
              <span
                key={p.id}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  fontSize: `${p.size}px`,
                  opacity: active ? p.opacity + strength * 0.38 : p.opacity,
                  transform: `translate(${p.flyX * strength}px, ${
                    p.flyY * strength
                  }px) scale(${1 + strength * 0.8})`,
                }}
              >
                {p.ch}
              </span>
            );
          })}
        </div>

        <h1
          className="path__title"
          style={{
            opacity: Math.min(1, 0.3 + scrollP * 1.2),
          }}
        >
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
            const scale = 0.65 + cardsVisible * 0.35;
            const x = offsets[index] * cardsVisible;
            const y = (1 - cardsVisible) * 80;

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