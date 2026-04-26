import React, { useEffect, useRef, useState } from "react";
import "./LandingJourney.css";
import { ASCII_FRAMES } from "./asciiFrames";

const TITLE = "THE INVISIBLE DATA";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function LandingJourney() {
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

      drawHeader(ctx, w, t);
      drawBackground(ctx, w, h, t);

      const duration = 4;
      const index = Math.floor(t / duration) % ASCII_FRAMES.length;
      const nextIndex = (index + 1) % ASCII_FRAMES.length;
      const localT = (t % duration) / duration;

      setCaption(ASCII_FRAMES[index].label);

      drawAscii({
        ctx,
        w,
        h,
        t,
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

      <div className="caption">{caption}</div>

      <div className="nav">
        <span>ABOUT</span>
        <span>PATH</span>
      </div>
    </div>
  );
}

function drawHeader(ctx, w, t) {
  ctx.font = `12px Courier New`;
  ctx.fillStyle = "white";
  ctx.fillText(TITLE, 20, 20);
}

function drawBackground(ctx, w, h, t) {
  ctx.font = `10px Courier New`;
  for (let y = 60; y < h; y += 12) {
    for (let x = 20; x < w; x += 14) {
      ctx.globalAlpha = 0.05;
      ctx.fillText(".", x, y);
    }
  }
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
      ctx.fillText(
        ch,
        startX + x * charW + shift,
        startY + y * lineH
      );
    }
  });

  ctx.globalAlpha = 1;
}