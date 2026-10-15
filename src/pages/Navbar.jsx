
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ theme = "dark" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goToLanding = () => {
    navigate("/", {
      state: {
        skipTitle: true,
        restartId: Date.now(),
      },
    });
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";

    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  return (
    <nav className={`site-nav site-nav--${theme}`}>
      <button
        type="button"
        className="site-nav__button site-nav__brand"
        onClick={goToLanding}
      >
        INVISIBLE DATA
      </button>

      <div className="site-nav__right">
        <button
          type="button"
          className={`site-nav__button ${
            isActive("/about") ? "site-nav__active" : ""
          }`}
          onClick={() => navigate("/about")}
        >
          ABOUT
        </button>

        <button
          type="button"
          className={`site-nav__button ${
            isActive("/path") ? "site-nav__active" : ""
          }`}
          onClick={() => navigate("/path")}
        >
          PATH
        </button>

        <button
          type="button"
          className={`site-nav__button ${
            isActive("/dear-peri") ? "site-nav__active" : ""
          }`}
          onClick={() => navigate("/dear-peri")}
        >
          DEAR PERI
        </button>
      </div>
    </nav>
  );
}
