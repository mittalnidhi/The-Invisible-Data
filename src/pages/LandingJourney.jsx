import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingJourney.css";
import { ASCII_FRAMES } from "./asciiFrames";
import { TITLE_ASCII } from "./titleAscii";

const NAV_TYPE_TIME = 3;
const TITLE_APPEAR_TIME = 1.4;
const FLY_TIME = 2.2;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

export default function LandingJourney() {
  const navigate = useNavigate();

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(performance.now());
  const flyStartRef = useRef(null);
  const animationStartRef = useRef(null);
  const modeRef = useRef("title");

  const [caption, setCaption] = useState("");
  const [mode, setMode] = useState("title");

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

    function handleClick(e) {
      if (e.target.closest(".nav")) return;

      if (modeRef.current === "title") {
        modeRef.current = "fly";
        setMode("fly");
        flyStartRef.current = performance.now();
      }
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

      if (modeRef.current === "title") {
        setCaption("");
        drawTitleGlitch(ctx, w, h, titleT);
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (modeRef.current === "fly") {
        const flyT = (now - flyStartRef.current) / 1000;

        setCaption("");
        drawTitleFlyAway(ctx, w, h, flyT);

        if (flyT >= FLY_TIME) {
          modeRef.current = "animation";
          setMode("animation");
          animationStartRef.current = performance.now();
        }

        rafRef.current = requestAnimationFrame(draw);
        return;
      }

     
      const animationT = (now - animationStartRef.current) / 1000;

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
    wrap.addEventListener("click", handleClick);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`landing ${mode}`}>
      <canvas ref={canvasRef} />

      <nav className="nav">
        <button className="nav-button nav-title-button" onClick={() => navigate("/")}>
          <span className="type-nav type-title">THE INVISIBLE DATA</span>
        </button>

        <div className="nav-right">
          <button className="nav-button nav-about-button" onClick={() => navigate("/about")}>
            <span className="type-nav type-about">ABOUT</span>
          </button>

          <button className="nav-button nav-path-button" onClick={() => navigate("/path")}>
            <span className="type-nav type-path">PATH</span>
          </button>

          <button className="nav-button nav-dear-button" onClick={() => navigate("/dear-peri")}>
            <span className="type-nav type-dear">DEAR PERI</span>
          </button>
        </div>
      </nav>

      {mode === "title" && (
        <div className="click-hint">CLICK / TOUCH TO BEGIN</div>
      )}

      <div className="caption">{caption}</div>
    </div>
  );
}

function getTitleLayout(w, h, zoom = 1) {
  const lines = TITLE_ASCII.split("\n").filter((line) => line.trim().length);
  const longest = Math.max(...lines.map((line) => line.length));

  const baseFontSize = Math.min(
    (w * 0.94) / longest / 0.56,
    (h * 0.66) / lines.length
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

function drawTitleGlitch(ctx, w, h, titleT) {
  const appear = clamp(titleT / TITLE_APPEAR_TIME, 0, 1);
  const glitchPower = clamp((titleT - TITLE_APPEAR_TIME) / 2.5, 0.18, 0.75);

  const { lines, fontSize, charW, lineH, startX, startY } = getTitleLayout(
    w,
    h,
    1.06
  );

  const dataChars = ["0", "1", "0", "1", "#", "%", "+", "*"];

  ctx.save();
  ctx.font = `700 ${fontSize}px "Cascadia Code", "Courier New", monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(244,240,232,0.96)";

  lines.forEach((line, y) => {
    const rowShift =
      Math.sin(titleT * 20 + y * 0.8) > 0.84
        ? rand(-32, 32) * glitchPower
        : 0;

    for (let x = 0; x < line.length; x++) {
      let ch = line[x];
      if (ch === " ") continue;

      if (Math.random() < glitchPower * 0.28) {
        ch = dataChars[(x + y + Math.floor(titleT * 18)) % dataChars.length];
      }

      if (Math.random() < glitchPower * 0.045) continue;

      const microX =
        Math.sin(titleT * 34 + x * 0.7 + y * 0.25) > 0.92
          ? rand(-16, 16) * glitchPower
          : 0;

      const scanline =
        Math.sin(y * 0.95 + titleT * 10) > 0.97 - glitchPower * 0.12;

      ctx.globalAlpha =
        appear *
        clamp(
          0.68 +
            Math.sin(titleT * 9 + x * 0.17 + y * 0.22) *
              (0.16 + glitchPower * 0.22),
          0.18,
          1
        );

      if (scanline) ctx.globalAlpha *= 0.38;

      ctx.fillText(
        ch,
        startX + x * charW + rowShift + microX,
        startY + y * lineH
      );
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawTitleFlyAway(ctx, w, h, flyT) {
  const progress = smoothstep(clamp(flyT / FLY_TIME, 0, 1));

  const { lines, fontSize, charW, lineH, startX, startY } = getTitleLayout(
    w,
    h,
    1.06
  );

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
        dataChars[(x + y + Math.floor(flyT * 26)) % dataChars.length];

      const distance = progress * (130 + Math.abs(seed % 620));
      const flyX = Math.cos(angle) * distance;
      const flyY = Math.sin(angle) * distance * 0.58 + progress * h * 0.18;

      const dissolve =
        Math.sin(flyT * 12 + x * 0.25 + y * 0.35) * progress * 28;

      ctx.globalAlpha = clamp(1 - progress * 0.88, 0, 1);

      ctx.fillText(
        ch,
        startX + x * charW + flyX + dissolve,
        startY + y * lineH + flyY
      );
    }
  });

  ctx.globalAlpha = progress * 0.85;
  drawAscii({
    ctx,
    w,
    h,
    t: 0,
    localT: 0,
    current: ASCII_FRAMES[0].art,
    next: ASCII_FRAMES[1]?.art || ASCII_FRAMES[0].art,
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