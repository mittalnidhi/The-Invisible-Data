import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingJourney.css";
import { ASCII_FRAMES } from "./asciiFrames";
import { TITLE_ASCII } from "./titleAscii";

const NAV_TYPE_TIME = 3;
const TITLE_APPEAR_TIME = 1.4;
const BREAK_TIME = 2.8;

const IMAGE_DURATION = 2.2;
const FULL_IMAGE_LOOP_TIME = ASCII_FRAMES.length * IMAGE_DURATION;

const POST_GLITCH_TIME = 0.85;
const COLLAPSE_TIME = 2.7;

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

  const breakStartRef = useRef(null);
  const animationStartRef = useRef(null);
  const postGlitchStartRef = useRef(null);
  const collapseStartRef = useRef(null);

  const modeRef = useRef("title");
  const hasNavigatedRef = useRef(false);

  const [caption, setCaption] = useState("");
  const [mode, setMode] = useState("title");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

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

    function handleMove(e) {
      setCursor({ x: e.clientX, y: e.clientY });
    }

    function handleClick(e) {
      if (e.target.closest(".nav")) return;

      if (modeRef.current === "title") {
        modeRef.current = "break";
        setMode("break");
        breakStartRef.current = performance.now();
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

      if (modeRef.current === "break") {
        const breakT = (now - breakStartRef.current) / 1000;

        setCaption("");
        drawTitleShatterFlow(ctx, w, h, breakT);

        if (breakT >= BREAK_TIME) {
          modeRef.current = "animation";
          setMode("animation");
          animationStartRef.current = performance.now();
        }

        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (modeRef.current === "animation") {
        const animationT = (now - animationStartRef.current) / 1000;

        if (animationT >= FULL_IMAGE_LOOP_TIME) {
          modeRef.current = "postGlitch";
          setMode("postGlitch");
          postGlitchStartRef.current = performance.now();
          rafRef.current = requestAnimationFrame(draw);
          return;
        }

        const index = Math.floor(animationT / IMAGE_DURATION) % ASCII_FRAMES.length;
        const nextIndex = (index + 1) % ASCII_FRAMES.length;
        const localT = (animationT % IMAGE_DURATION) / IMAGE_DURATION;

        setCaption(ASCII_FRAMES[index].label || "");

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
        return;
      }

      if (modeRef.current === "postGlitch") {
        const glitchT = (now - postGlitchStartRef.current) / 1000;

        setCaption("");
        drawPostAnimationGlitch(ctx, w, h, glitchT);

        if (glitchT >= POST_GLITCH_TIME) {
          modeRef.current = "collapse";
          setMode("collapse");
          collapseStartRef.current = performance.now();
        }

        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (modeRef.current === "collapse") {
        const collapseT = (now - collapseStartRef.current) / 1000;

        setCaption("");
        drawBinaryCollapse(ctx, w, h, collapseT);

        if (collapseT >= COLLAPSE_TIME && !hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          navigate("/about", { state: { fromLandingCollapse: true } });
          return;
        }

        rafRef.current = requestAnimationFrame(draw);
      }
    }

    resize();

    window.addEventListener("resize", resize);
    wrap.addEventListener("mousemove", handleMove);
    wrap.addEventListener("click", handleClick);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("mousemove", handleMove);
      wrap.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [navigate]);

  return (
    <div ref={wrapRef} className={`landing ${mode}`}>
      <div id="timeout-warning">Are you still there? Redirecting home in 10 seconds...</div>
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
        <div
          className="cursor-tip"
          style={{
            left: cursor.x + 16,
            top: cursor.y + 16,
          }}
        >
          click
        </div>
      )}

      <div className="caption">{caption}</div>
    </div>
  );
}

/* ================= TITLE ================= */

function getTitleLayout(w, h, zoom = 1) {
  const lines = TITLE_ASCII.split("\n").filter((line) => line.trim().length);
  const longest = Math.max(...lines.map((line) => line.length));

  const baseFontSize = Math.min(
    (w * 0.84) / longest / 0.56,
    (h * 0.7) / lines.length
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
  const glitchPower = clamp((titleT - TITLE_APPEAR_TIME) / 2.5, 0.12, 0.7);

  const { lines, fontSize, charW, lineH, startX, startY } = getTitleLayout(
    w,
    h,
    1.04
  );

  const dataChars = ["0", "1", "#", "%", "+", "*"];

  ctx.save();
  ctx.font = `700 ${fontSize}px "Cascadia Code", "Courier New", monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(244,240,232,0.96)";

  lines.forEach((line, y) => {
    const horizontalShift =
      Math.sin(titleT * 21 + y * 0.9) > 0.82
        ? rand(-38, 38) * glitchPower
        : 0;

    const verticalShift =
      Math.sin(titleT * 16 + y * 1.7) > 0.9
        ? rand(-18, 18) * glitchPower
        : 0;

    for (let x = 0; x < line.length; x++) {
      let ch = line[x];
      if (ch === " ") continue;

      if (Math.random() < glitchPower * 0.22) {
        ch = dataChars[(x + y + Math.floor(titleT * 18)) % dataChars.length];
      }

      if (Math.random() < glitchPower * 0.035) continue;

      const columnShift =
        Math.sin(titleT * 18 + x * 0.42) > 0.94
          ? rand(-28, 28) * glitchPower
          : 0;

      ctx.globalAlpha =
        appear *
        clamp(
          0.72 +
            Math.sin(titleT * 9 + x * 0.17 + y * 0.22) *
              (0.12 + glitchPower * 0.22),
          0.18,
          1
        );

      ctx.fillText(
        ch,
        startX + x * charW + horizontalShift,
        startY + y * lineH + verticalShift + columnShift
      );
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawTitleShatterFlow(ctx, w, h, breakT) {
  const progress = smoothstep(clamp(breakT / BREAK_TIME, 0, 1));
  const { lines, fontSize, charW, lineH, startX, startY } = getTitleLayout(
    w,
    h,
    1.04
  );

  const dataChars = ["0", "1", "#", "%", "+", "*"];

  ctx.save();
  ctx.font = `700 ${fontSize}px "Cascadia Code", "Courier New", monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(244,240,232,0.96)";

  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line[x] === " ") continue;

      const seed = Math.sin(x * 91.7 + y * 53.2) * 10000;
      const seed2 = Math.cos(x * 41.2 + y * 77.6) * 10000;

      const ch = dataChars[(x + y + Math.floor(breakT * 28)) % dataChars.length];

      const startCharX = startX + x * charW;
      const startCharY = startY + y * lineH;

      const fractureX = Math.sign(seed) * Math.abs(seed % 190) * progress;
      const fractureY = Math.sign(seed2) * Math.abs(seed2 % 90) * progress;

      const flowX =
        Math.sin(breakT * 1.5 + x * 0.15 + y * 0.1) * w * 0.28 * progress +
        Math.cos(breakT * 0.9 + y * 0.35) * 70 * progress;

      const flowY =
        Math.cos(breakT * 1.2 + x * 0.11) * h * 0.18 * progress +
        Math.sin(breakT * 2.1 + y * 0.2) * 44 * progress;

      const wrapX = ((startCharX + fractureX + flowX) % (w + 120)) - 60;
      const yPos = startCharY + fractureY + flowY;

      ctx.globalAlpha = clamp(1 - progress * 0.82, 0, 1);
      ctx.fillText(ch, wrapX, yPos);
    }
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ================= END GLITCH ================= */

function drawPostAnimationGlitch(ctx, w, h, glitchT) {
  const progress = clamp(glitchT / POST_GLITCH_TIME, 0, 1);
  const lastFrame = ASCII_FRAMES[ASCII_FRAMES.length - 1].art;

  ctx.save();

  ctx.globalAlpha = clamp(1 - progress * 1.4, 0, 1);
  drawAscii({
    ctx,
    w,
    h,
    t: glitchT * 9,
    localT: 0.98,
    current: lastFrame,
    next: lastFrame,
  });

  for (let i = 0; i < 55; i++) {
    const y = rand(0, h);
    const sliceH = rand(1, 12);
    const shift = rand(-260, 260) * progress;

    ctx.globalAlpha = rand(0.04, 0.2) * progress;
    ctx.fillStyle = "rgba(244,240,232,0.9)";
    ctx.fillRect(shift, y, w, sliceH);
  }

  ctx.globalAlpha = smoothstep(progress);
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, w, h);

  const chars = ["0", "1", "|", "/", "\\", ".", "*", "+", "#", "%"];

  for (let i = 0; i < 190; i++) {
    const seed = Math.sin(i * 71.91) * 10000;
    const seed2 = Math.cos(i * 39.28) * 10000;

    const x = Math.abs(seed % w) + Math.sin(glitchT * 2.1 + i) * 16;
    const y = Math.abs(seed2 % h) + Math.cos(glitchT * 1.8 + i) * 12;

    ctx.font = `700 ${8 + Math.abs(seed % 7)}px "Cascadia Code", "Courier New", monospace`;
    ctx.globalAlpha = smoothstep(progress) * (0.2 + Math.abs(seed % 0.55));
    ctx.fillStyle = "rgba(244,240,232,0.85)";
    ctx.fillText(chars[i % chars.length], x, y);
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ================= FALL + BOUNCE ================= */

function drawBinaryCollapse(ctx, w, h, collapseT) {
  const progress = clamp(collapseT / COLLAPSE_TIME, 0, 1);
  const chars = ["0", "1", "|", "/", "\\", ".", "*", "+", "#", "%"];

  ctx.save();

  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, w, h);

  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(244,240,232,0.9)";

  for (let i = 0; i < 320; i++) {
    const seed = Math.sin(i * 91.731) * 10000;
    const seed2 = Math.cos(i * 47.291) * 10000;
    const seed3 = Math.sin(i * 17.731) * 10000;

    const startX = Math.abs(seed % w);
    const startY = Math.abs(seed2 % h);

    const delay = Math.abs(seed3 % 0.22);
    const local = clamp((progress - delay) / (1 - delay), 0, 1);

    const fall = smoothstep(local);

    const size = 8 + Math.abs(seed % 9);
    ctx.font = `700 ${size}px "Cascadia Code", "Courier New", monospace`;

    const drift =
      Math.sin(collapseT * 2.8 + i * 0.13) * 38 * (1 - fall) +
      Math.sin(collapseT * 5.7 + i) * 10;

    const gravity = fall * fall * h * (0.95 + Math.abs(seed2 % 0.42));

    let x = startX + drift;
    let y = startY + gravity;

    const floor =
      h -
      22 -
      Math.abs(seed % 105) -
      Math.sin(i * 0.33) * 26;

    if (y > floor) {
      const bounceEnergy = Math.pow(1 - local, 1.45);
      const bounce =
        Math.abs(Math.sin(collapseT * 11 + i * 0.08)) *
        (26 + Math.abs(seed % 70)) *
        bounceEnergy;

      y = floor - bounce;
      x += Math.sin(collapseT * 7 + i) * 16 * bounceEnergy;
    }

    const fade = clamp(1 - (progress - 0.88) / 0.12, 0, 1);

    ctx.globalAlpha =
      clamp(0.22 + local * 0.68, 0, 0.9) *
      fade *
      (0.48 + Math.abs(seed % 0.42));

    ctx.fillText(chars[(i + Math.floor(collapseT * 20)) % chars.length], x, y);
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ================= BACKGROUND ================= */

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

/* ================= ASCII IMAGE ANIMATION ================= */

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

  ctx.font = `${fontSize}px "Courier New", monospace`;
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