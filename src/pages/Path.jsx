import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Path.css";

const FINAL_TEXT = "WE MEET YOU WHERE YOU ARE AT YOUR JOURNEY";

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

  const cardsVisible = Math.max(0, Math.min(1, (scrollP - 0.45) / 0.3));

  const cards = [
    {
      title: "SYMPTOMS",
      back: "Open Colony of Symptoms.",
      route: "/colony",
    },
    {
      title: "CLUSTER",
      back: "Open Symptom Cluster.",
      route: "/cluster",
    },
    {
      title: "EXPERIENCE",
      back: "Read lived experience stories.",
      route: "/experiences",
    },
  ];

  return (
    <main className="path">
      <nav className="pathNav">
        <button className="pathNav__button" onClick={() => navigate("/")}>
          THE INVISIBLE DATA
        </button>

        <div className="pathNav__right">
          <button className="pathNav__button" onClick={() => navigate("/about")}>
            ABOUT
          </button>

          <button className="pathNav__button" onClick={() => navigate("/path")}>
            PATH
          </button>

          <button
            className="pathNav__button"
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
            opacity: 0.2 + scrollP * 0.8,
            filter: `blur(${8 - scrollP * 8}px)`,
          }}
        >
          {FINAL_TEXT}
        </h1>

        <div
          className="path__cards"
          style={{
            opacity: cardsVisible,
          }}
        >
          {cards.map((card, index) => {
            const offsets = [-270, 0, 270];
            const scale = 0.65 + cardsVisible * 0.35;
            const x = offsets[index] * cardsVisible;
            const y = (1 - cardsVisible) * 80;

            return (
              <button
                key={card.title}
                className="pathCard"
                onClick={() => navigate(card.route)}
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${scale})`,
                }}
              >
                <span className="pathCard__inner">
                  <span className="pathCard__face pathCard__front">
                    {card.title}
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