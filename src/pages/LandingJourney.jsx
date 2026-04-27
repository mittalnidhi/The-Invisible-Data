import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingJourney.css";
import { ASCII_FRAMES } from "./asciiFrames";
import { TITLE_ASCII } from "./titleAscii";

const NAV_TYPE_TIME = 2.5;
const TITLE_APPEAR_TIME = 1.2;
const TITLE_HOLD_TIME = 3;
const TITLE_ZOOM_TIME = 4;
const SHATTER_TIME = 3.8;

const ANIMATION_START =
  NAV_TYPE_TIME +
  TITLE_APPEAR_TIME +
  TITLE_HOLD_TIME +
  TITLE_ZOOM_TIME +
  SHATTER_TIME;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function LandingJourney() {
  const navigate = useNavigate();

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(performance.now());

  const [caption, setCaption] = useState("");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const t = (now - startRef.current) / 1000;

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      drawBackground(ctx, w, h);

      if (t < NAV_TYPE_TIME) {
        setCaption("");
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const titleT = t - NAV_TYPE_TIME;

      if (titleT < TITLE_APPEAR_TIME + TITLE_HOLD_TIME + TITLE_ZOOM_TIME) {
        setCaption("");
        drawTitle(ctx, w, h, titleT);
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const shatterT =
        titleT - TITLE_APPEAR_TIME - TITLE_HOLD_TIME - TITLE_ZOOM_TIME;

      if (shatterT < SHATTER_TIME) {
        setCaption("");
        drawTitleShatter(ctx, w, h, shatterT);
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // EXISTING ASCII IMAGE ANIMATION — UNCHANGED
      const animationT = t - ANIMATION_START;

      const duration = 4;
      const index = Math.floor(animationT / duration) % ASCII_FRAMES.length;
      const nextIndex = (index + 1) % ASCII_FRAMES.length;
      const localT = (animationT % duration) / duration;

      setCaption(ASCII_FRAMES[index].label);

      drawAscii({
        ctx,
        w,
        h,
        t: animationT,
        localT,
        current: ASCII_FRAMES[index].art,
        next: ASCII_FRAMES[nextIndex].art,
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className="landing">
      <canvas ref={canvasRef} />

      <nav className="nav">
        <button onClick={() => navigate("/")}>
          <span className="type-nav type-title">THE INVISIBLE DATA</span>
        </button>

        <div className="nav-right">
          <button onClick={() => navigate("/about")}>
            <span className="type-nav type-about">ABOUT</span>
          </button>

          <button onClick={() => navigate("/path")}>
            <span className="type-nav type-path">PATH</span>
          </button>

          <button onClick={() => navigate("/dear-peri")}>
            <span className="type-nav type-dear">DEAR PERI</span>
          </button>
        </div>
      </nav>

      <div className="caption">{caption}</div>
    </div>
  );
}



function getTitleLayout(w, h, zoom = 1) {
  const lines = TITLE_ASCII.split("\n").filter((line) => line.trim().length);
  const longest = Math.max(...lines.map((line) => line.length));

  const baseFontSize = Math.min(
    (w * 0.9) / longest / 0.56,
    (h * 0.62) / lines.length
  );

  const fontSize = baseFontSize * zoom;
  const charW = fontSize * 0.56;
  const lineH = fontSize * 0.78;

  return {
    lines,
    fontSize,
    charW,
    lineH,
    startX: w / 2 - (longest * charW) / 2,
    startY: h / 2 - (lines.length * lineH) / 2,
  };
}

function drawTitle(ctx, w, h, titleT) {
  const appear = clamp(titleT / TITLE_APPEAR_TIME, 0, 1);

  const zoomStart = TITLE_APPEAR_TIME + TITLE_HOLD_TIME;
  const zoomProgress =
    titleT > zoomStart
      ? clamp((titleT - zoomStart) / TITLE_ZOOM_TIME, 0, 1)
      : 0;

  const zoom = 1 + easeOutCubic(zoomProgress) * 0.42;

  const { lines, fontSize, charW, lineH, startX, startY } = getTitleLayout(
    w,
    h,
    zoom
  );

  ctx.save();
  ctx.font = `700 ${fontSize}px "Cascadia Code", "Courier New", monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(244,240,232,0.96)";

  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      const ch = line[x];
      if (ch === " ") continue;

      ctx.globalAlpha = appear;
      ctx.fillText(ch, startX + x * charW, startY + y * lineH);
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawTitleShatter(ctx, w, h, shatterT) {
  const zoom = 1.42;
  const { lines, fontSize, charW, lineH, startX, startY } = getTitleLayout(
    w,
    h,
    zoom
  );

  const progress = clamp(shatterT / SHATTER_TIME, 0, 1);
  const eased = smoothstep(progress);
  const fade = clamp(1 - progress * 0.9, 0, 1);

  const dataChars = ["0", "1", "0", "1", "#", "%", "+", "*"];

  ctx.save();
  ctx.font = `700 ${fontSize}px "Cascadia Code", "Courier New", monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(244,240,232,0.96)";

  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      const original = line[x];
      if (original === " ") continue;

      const seed = Math.sin(x * 91.7 + y * 53.2) * 10000;
      const angle = seed * Math.PI * 2;

      const ch =
        dataChars[(x + y + Math.floor(shatterT * 18)) % dataChars.length];

      const drift = eased * (120 + Math.abs(seed % 360));
      const floatX = Math.cos(angle) * drift;
      const floatY = Math.sin(angle) * drift * 0.45 + eased * h * 0.22;

      const dissolve =
        Math.sin(shatterT * 8 + x * 0.25 + y * 0.35) * eased * 14;

      ctx.globalAlpha = fade;

      ctx.fillText(
        ch,
        startX + x * charW + floatX + dissolve,
        startY + y * lineH + floatY
      );
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}



function drawBackground(ctx, w, h) {
  ctx.font = `10px "Cascadia Code", "Courier New", monospace`;
  ctx.fillStyle = "rgba(244,240,232,0.75)";

  for (let y = 60; y < h; y += 12) {
    for (let x = 20; x < w; x += 14) {
      ctx.globalAlpha = 0.05;
      ctx.fillText(".", x, y);
    }
  }

  ctx.globalAlpha = 1;
}

/* ascii animation*/

function drawAscii({ ctx, w, h, t, localT, current, next }) {
  const isGlitch = localT > 0.75;
  const transitionT = isGlitch ? (localT - 0.75) / 0.25 : 0;

  const art = transitionT > 0.5 ? next : current;
  const lines = art.split("\n");

  const fontSize = Math.min(w / 90, h / 60);
  const charW = fontSize * 0.6;
  const lineH = fontSize * 0.75;

  const longest = Math.max(...lines.map((l) => l.length));
  const startX = w / 2 - (longest * charW) / 2;
  const startY = h / 2 - (lines.length * lineH) / 2;

  const dataChars = ["0", "1", "#", "@", "%"];

  ctx.font = `${fontSize}px Courier New`;
  ctx.fillStyle = "white";

  lines.forEach((line, y) => {
    const shift =
      isGlitch && Math.random() > 0.7
        ? rand(-80, 80) * transitionT
        : 0;

    for (let x = 0; x < line.length; x++) {
      let ch = line[x];
      if (ch === " ") continue;

      const isFace = "/\\|>_o.-".includes(ch);

      if (!isFace && Math.random() < 0.6) {
        ch = dataChars[(x + y + Math.floor(t * 10)) % dataChars.length];
      }

      if (Math.random() < transitionT * 0.2) continue;

      ctx.globalAlpha = 0.8;
      ctx.fillText(ch, startX + x * charW + shift, startY + y * lineH);
    }
  });

  ctx.globalAlpha = 1;
}