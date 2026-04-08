import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingJourney.css";

const BG = "#000000";
const INK = "rgba(245,240,233,0.98)";

const TITLE_1 = "The Invisible Data";
const TITLE_2 = "mapping the perimenopausal Data Gap";
const TITLE_3 = "by Nichi Mittal";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  return 0.5 - Math.cos(Math.PI * t) / 2;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function typeCount(elapsed, start, cps, text) {
  if (elapsed < start) return 0;
  return clamp(Math.floor((elapsed - start) * cps), 0, text.length);
}

function cubicBezier(p0, p1, p2, p3, steps = 140) {
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const mt = 1 - t;
    pts.push({
      x:
        mt * mt * mt * p0.x +
        3 * mt * mt * t * p1.x +
        3 * mt * t * t * p2.x +
        t * t * t * p3.x,
      y:
        mt * mt * mt * p0.y +
        3 * mt * mt * t * p1.y +
        3 * mt * t * t * p2.y +
        t * t * t * p3.y,
    });
  }
  return pts;
}

function buildLengths(points) {
  const lengths = [];
  let total = 0;

  for (let i = 0; i < points.length - 1; i += 1) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const d = Math.sqrt(dx * dx + dy * dy);
    lengths.push({ start: total, end: total + d });
    total += d;
  }

  return { lengths, total };
}

function getPoint(points, meta, t) {
  const target = clamp(t, 0, 1) * meta.total;

  for (let i = 0; i < meta.lengths.length; i += 1) {
    const seg = meta.lengths[i];
    if (target >= seg.start && target <= seg.end) {
      const local = (target - seg.start) / (seg.end - seg.start || 1);
      return {
        x: lerp(points[i].x, points[i + 1].x, local),
        y: lerp(points[i].y, points[i + 1].y, local),
      };
    }
  }

  return points[points.length - 1];
}

function drawTypedText(ctx, text, x, y, count, font, alpha = 1) {
  const visible = text.slice(0, count);

  ctx.save();
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = `rgba(245,240,233,${alpha})`;
  ctx.fillText(visible, x, y);

  if (count < text.length) {
    const w = ctx.measureText(visible).width;
    const cursorX = x + w / 2 + 6;
    ctx.beginPath();
    ctx.moveTo(cursorX, y - 12);
    ctx.lineTo(cursorX, y + 12);
    ctx.strokeStyle = `rgba(245,240,233,${alpha * 0.9})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawSketchLine(ctx, points, revealT, lineWidth = 3.2) {
  const maxIndex = Math.max(2, Math.floor((points.length - 1) * clamp(revealT, 0, 1)));

  const passes = [
    { seed: 0.17, alpha: 0.98, width: lineWidth },
    { seed: 0.51, alpha: 0.52, width: Math.max(1.2, lineWidth - 1.05) },
  ];

  passes.forEach((pass) => {
    ctx.beginPath();
    for (let i = 0; i < maxIndex; i += 1) {
      const p = points[i];
      const jx = Math.sin(i * 0.71 + pass.seed * 11) * 0.55;
      const jy = Math.cos(i * 0.93 + pass.seed * 7) * 0.55;
      const x = p.x + jx;
      const y = p.y + jy;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(245,240,233,${pass.alpha})`;
    ctx.lineWidth = pass.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  });
}

function drawDot(ctx, x, y, r = 7.5) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = INK;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function getPathAngle(points, meta, t) {
  const prev = getPoint(points, meta, Math.max(0, t - 0.01));
  const next = getPoint(points, meta, Math.min(1, t + 0.01));
  return Math.atan2(next.y - prev.y, next.x - prev.x);
}

function drawHandTextAlongLine(
  ctx,
  text,
  points,
  meta,
  progress,
  {
    startT = 0,
    endT = 1,
    offsetY = -20,
    font = '24px "Brush Script MT", "Segoe Script", cursive',
    alpha = 0.96,
    spacing = 18,
  } = {}
) {
  const count = Math.floor(text.length * clamp(progress, 0, 1));
  if (count <= 0) return;

  ctx.save();
  ctx.fillStyle = `rgba(245,240,233,${alpha})`;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const chars = text.split("");
  const totalSpan = Math.max(1, (count - 1) * spacing);

  for (let i = 0; i < count; i += 1) {
    const charProgress = totalSpan === 0 ? 0 : (i * spacing) / totalSpan;
    const pathT = lerp(startT, endT, charProgress);

    const p = getPoint(points, meta, pathT);
    const angle = getPathAngle(points, meta, pathT);

    const jitterX = Math.sin(i * 0.45) * 0.35;
    const jitterY = Math.cos(i * 0.37) * 0.35;

    ctx.save();
    ctx.translate(p.x + jitterX, p.y + offsetY + jitterY);
    ctx.rotate(angle);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function buildWorldPaths(width, height) {
  const worldWidth = width * 2.15;

  const path1 = cubicBezier(
    { x: -worldWidth * 0.08, y: height * 0.53 },
    { x: worldWidth * 0.05, y: height * 0.53 },
    { x: worldWidth * 0.12, y: height * 0.50 },
    { x: worldWidth * 0.34, y: height * 0.50 },
    160
  );

  const path2 = cubicBezier(
    { x: worldWidth * 0.34, y: height * 0.50 },
    { x: worldWidth * 0.45, y: height * 0.50 },
    { x: worldWidth * 0.50, y: height * 0.74 },
    { x: worldWidth * 0.66, y: height * 0.80 },
    140
  );

  const path3 = cubicBezier(
    { x: worldWidth * 0.66, y: height * 0.80 },
    { x: worldWidth * 0.82, y: height * 0.87 },
    { x: worldWidth * 0.98, y: height * 0.72 },
    { x: worldWidth * 1.18, y: height * 0.72 },
    150
  );

  return { worldWidth, path1, path2, path3 };
}

function drawStoryAnimation(ctx, width, height, elapsed) {
  const { worldWidth, path1, path2, path3 } = buildWorldPaths(width, height);

  const meta1 = buildLengths(path1);
  const meta2 = buildLengths(path2);
  const meta3 = buildLengths(path3);

  const phase1 = clamp(elapsed / 6, 0, 1);
  const phase2 = clamp((elapsed - 6) / 6, 0, 1);
  const pausePhase = clamp((elapsed - 12) / 10, 0, 1);

  let cameraX = 0;

  if (phase1 < 1) {
    const dot1 = getPoint(path1, meta1, easeOut(phase1));
    cameraX = clamp(dot1.x - width * 0.5, 0, worldWidth - width);

    ctx.save();
    ctx.translate(-cameraX, 0);

    drawSketchLine(ctx, path1, phase1, 4.2);
    drawDot(ctx, dot1.x, dot1.y, 8);

    if (phase1 > 0.14) {
      drawHandTextAlongLine(
        ctx,
        "Symptoms of perimenopause may appear later",
        path1,
        meta1,
        clamp((phase1 - 0.14) / 0.70, 0, 1),
        {
          startT: 0.14,
          endT: 0.76,
          offsetY: -22,
          spacing: 20,
          font: '26px "Brush Script MT", "Segoe Script", cursive',
        }
      );
    }

    ctx.restore();
    return;
  }

  if (phase2 < 1) {
    const dot2 = getPoint(path2, meta2, easeOut(phase2));
    cameraX = clamp(dot2.x - width * 0.5, 0, worldWidth - width);

    ctx.save();
    ctx.translate(-cameraX, 0);

    drawSketchLine(ctx, path1, 1, 4.2);
    drawSketchLine(ctx, path2, phase2, 3.3);
    drawDot(ctx, dot2.x, dot2.y, 8);

    drawHandTextAlongLine(
      ctx,
      "Symptoms of perimenopause may appear later",
      path1,
      meta1,
      1,
      {
        startT: 0.14,
        endT: 0.76,
        offsetY: -22,
        spacing: 20,
        font: '26px "Brush Script MT", "Segoe Script", cursive',
        alpha: 0.92,
      }
    );

    if (phase2 > 0.18) {
      drawHandTextAlongLine(
        ctx,
        "but the stem starts building years before it shows up",
        path2,
        meta2,
        clamp((phase2 - 0.18) / 0.66, 0, 1),
        {
          startT: 0.12,
          endT: 0.94,
          offsetY: -18,
          spacing: 16,
          font: '24px "Brush Script MT", "Segoe Script", cursive',
        }
      );
    }

    ctx.restore();
    return;
  }

  const dot3 = getPoint(path3, meta3, 1);
  cameraX = clamp(dot3.x - width * 0.56, 0, worldWidth - width);

  ctx.save();
  ctx.translate(-cameraX, 0);

  drawSketchLine(ctx, path1, 1, 4.2);
  drawSketchLine(ctx, path2, 1, 3.3);
  drawSketchLine(ctx, path3, 1, 2.8);

  drawHandTextAlongLine(
    ctx,
    "Symptoms of perimenopause may appear later",
    path1,
    meta1,
    1,
    {
      startT: 0.14,
      endT: 0.76,
      offsetY: -22,
      spacing: 20,
      font: '26px "Brush Script MT", "Segoe Script", cursive',
      alpha: 0.92,
    }
  );

  drawHandTextAlongLine(
    ctx,
    "but the stem starts building years before it shows up",
    path2,
    meta2,
    1,
    {
      startT: 0.12,
      endT: 0.94,
      offsetY: -18,
      spacing: 16,
      font: '24px "Brush Script MT", "Segoe Script", cursive',
      alpha: 0.96,
    }
  );

  drawDot(ctx, dot3.x, dot3.y, 8);

  ctx.restore();

  if (pausePhase < 1) {
    // intentional hold, no visual change
  }
}

export default function LandingJourney() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const startedAt = performance.now();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now) => {
      const elapsed = (now - startedAt) / 1000;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);

      const c1 = typeCount(elapsed, 0.2, 14, TITLE_1);
      const c2 = typeCount(elapsed, 1.8, 22, TITLE_2);
      const c3 = typeCount(elapsed, 3.7, 16, TITLE_3);

      const wipeStart = 6.0;
      const wipeDuration = 1.0;
      const animStart = wipeStart + wipeDuration;

      if (elapsed < animStart) {
        drawTypedText(
          ctx,
          TITLE_1,
          width / 2,
          height * 0.42,
          c1,
          '54px "Brush Script MT", "Segoe Script", cursive',
          0.96
        );

        drawTypedText(
          ctx,
          TITLE_2,
          width / 2,
          height * 0.50,
          c2,
          "24px Georgia, serif",
          0.90
        );

        drawTypedText(
          ctx,
          TITLE_3,
          width / 2,
          height * 0.58,
          c3,
          "19px Georgia, serif",
          0.72
        );

        if (elapsed > wipeStart) {
          const wipeT = clamp((elapsed - wipeStart) / wipeDuration, 0, 1);
          const wipeX = lerp(-width * 1.15, width * 1.15, easeInOut(wipeT));
          ctx.save();
          ctx.fillStyle = BG;
          ctx.fillRect(wipeX, 0, width * 1.2, height);
          ctx.restore();
        }
      } else {
        drawStoryAnimation(ctx, width, height, elapsed - animStart);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="landing-container">
      <canvas ref={canvasRef} className="landing-canvas" />
      <button className="skip-button" onClick={() => navigate("/home")}>
        Skip →
      </button>
    </div>
  );
}