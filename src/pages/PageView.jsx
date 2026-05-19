import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageView.css";

export default function PageView() {
  const navigate = useNavigate();

  return (
    <main className="pageView">
      <div id="timeout-warning">Are you still there? Redirecting home in 10 seconds...</div>
      <nav className="nav">
        <button
          className="nav-button nav-title-button"
          onClick={() => navigate("/")}
        >
          INVISIBLE DATA
        </button>

        <div className="nav-right">
          <button
            className="nav-button nav-button--active"
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

      <button
        className="pageView__toggle"
        onClick={() => navigate("/about")}
      >
        Animation view
      </button>

      <section className="pageView__content">
        <h1>About</h1>
      </section>
    </main>
  );
}