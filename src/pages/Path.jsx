import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Path.css";

const FINAL_TEXT = "WE MEET YOU WHERE YOU ARE AT YOUR JOURNEY";

function makeAsciiText(text) {
  return text
    .split(" ")
    .map((word) => word)
    .join("   ");
}

export default function Path() {
  const navigate = useNavigate();
  const [settled, setSettled] = useState(false);

  const chars = useMemo(() => {
    const pool = ["0", "1", "|", "/", "\\", "+", "*", ".", "#", "%"];
    return Array.from({ length: 260 }, (_, i) => ({
      id: i,
      ch: pool[i % pool.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 1.2,
      size: 9 + Math.random() * 12,
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 2100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={`path ${settled ? "is-settled" : ""}`}>
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
          <button className="pathNav__button" onClick={() => navigate("/dear-peri")}>
            DEAR PERI
          </button>
        </div>
      </nav>

      <section className="path__stage">
        <div className="path__glitchField" aria-hidden="true">
          {chars.map((item) => (
            <span
              key={item.id}
              style={{
                left: `${item.left}%`,
                top: `${item.top}%`,
                animationDelay: `${item.delay}s`,
                fontSize: `${item.size}px`,
              }}
            >
              {item.ch}
            </span>
          ))}
        </div>

        <h1 className="path__asciiTitle">
          {makeAsciiText(FINAL_TEXT)}
        </h1>
      </section>
    </main>
  );
}