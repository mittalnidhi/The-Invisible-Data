import React, { useEffect, useMemo, useRef, useState } from "react";
import "./experience.css";

const PHASE_DEPTH = 1100;
const FOCAL_LENGTH = 760;
const MAX_RENDER_DISTANCE = 2600;
const MIN_RENDER_DISTANCE = 20;

const PHASES = [
  {
    id: "Confusion",
    title: "Confusion",
    tint: "255,200,232",
    spreadX: 420,
    spreadY: 250,
    turbulence: 0.4,
    nodes: [
      { label: "Unpredictable Symptoms", rank: 1 },
      { label: "Lack of clarity", rank: 2 },
      { label: "Emotional Unstability", rank: 3 },
      { label: "Self- Doubt", rank: 4 },
      { label: "Need for Direction", rank: 5 },
    ],
  },
  {
    id: "transition",
    title: "Transitonal phase",
    tint: "255,190,225",
    spreadX: 480,
    spreadY: 220,
    turbulence: 0.28,
    nodes: [
      { label: "Loss of Identity", rank: 1 },
      { label: "Autonomy", rank: 2 },
      { label: "Self image", rank: 3 },
      { label: "Career change", rank: 4 },
      { label: "Body trust", rank: 5 },
      { label: "Lack of Confidence", rank: 6 },
      { label: "Relationship changes", rank: 6 },
      { label: "Ageing parents", rank: 6 },
    ],
  },
  
  {
    id: "healthcare",
    title: "HEALTHCARE GAPS",
    tint: "255,210,230",
    spreadX: 360,
    spreadY: 210,
    turbulence: 0.7,
    nodes: [
      { label: "Gaslighting", rank: 1 },
      { label: "Lack of treatment", rank: 2 },
      { label: "Dismissal", rank: 3 },
      { label: "Age bias", rank: 4 },
      { label: "Delayed diagnosis", rank: 5 },
    ],
  },
  {
    id: "symptoms",
    title: "SYMPTOM OUTBREAK",
    tint: "255,220,236",
    spreadX: 320,
    spreadY: 180,
    turbulence: 0.95,
    nodes: [
      { label: "Sleep disruption", rank: 1 },
      { label: "Brain fog", rank: 2 },
      { label: "Heat spikes", rank: 3 },
      { label: "Body pain", rank: 4 },
      { label: "Mood volatility", rank: 5 },
      { label: "Fatigue", rank: 6 },
    ],
  },
  {
    id: "social",
    title: "SOCIAL ANXIETY",
    tint: "255,212,236",
    spreadX: 300,
    spreadY: 165,
    turbulence: 0.82,
    nodes: [
      { label: "Workplace masking", rank: 1 },
      { label: "Withdrawing socially", rank: 2 },
      { label: "Relationship strain", rank: 3 },
      { label: "Public discomfort", rank: 4 },
      { label: "Isolation", rank: 5 },
    ],
  },
  {
    id: "hope",
    title: "HOPE",
    tint: "255,225,240",
    spreadX: 350,
    spreadY: 200,
    turbulence: 0.5,
    nodes: [
      { label: "Finding language", rank: 1 },
      { label: "Community knowledge", rank: 2 },
      { label: "Small experiments", rank: 3 },
      { label: "Recognition", rank: 4 },
    ],
  },
  {
    id: "reclaiming",
    title: "RECLAIMING SELF",
    tint: "255,235,245",
    spreadX: 380,
    spreadY: 220,
    turbulence: 0.34,
    nodes: [
      { label: "New baseline", rank: 1 },
      { label: "Self trust", rank: 2 },
      { label: "Selective care", rank: 3 },
      { label: "Boundaries", rank: 4 },
      { label: "Reorientation", rank: 5 },
    ],
  },
];

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function seeded(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function projectPoint(point, camera, width, height) {
  const dz = point.z - camera.z;
  if (dz > -MIN_RENDER_DISTANCE || dz < -MAX_RENDER_DISTANCE) return null;

  const perspective = FOCAL_LENGTH / -dz;
  const sx = width / 2 + (point.x - camera.x) * perspective;
  const sy = height / 2 + (point.y - camera.y) * perspective;

  if (sx < -400 || sx > width + 400 || sy < -300 || sy > height + 300) return null;

  return { x: sx, y: sy, scale: perspective, dz };
}

function buildDust(count = 720) {
  return Array.from({ length: count }, (_, i) => ({
    x: lerp(-1050, 1050, seeded(i * 1.9 + 3)),
    y: lerp(-620, 620, seeded(i * 2.7 + 5)),
    z: lerp(200, -((PHASES.length - 1) * PHASE_DEPTH) - 620, seeded(i * 4.1 + 11)),
    size: lerp(0.18, 0.5, seeded(i * 5.9 + 13)),
    alpha: lerp(0.02, 0.08, seeded(i * 7.1 + 17)),
  }));
}

function buildGraphTrails(phase, phaseIndex, zCenter) {
  const trailCount = phase.nodes.length + 8;
  const trails = [];

  for (let t = 0; t < trailCount; t += 1) {
    const baseSeed = phaseIndex * 700 + t * 47 + 100;
    const pointCount = Math.floor(6 + seeded(baseSeed + 1) * 7);

    const angle = seeded(baseSeed + 2) * Math.PI * 2;
    const startX = Math.cos(angle) * phase.spreadX * lerp(0.45, 0.95, seeded(baseSeed + 3));
    const startY = (seeded(baseSeed + 4) - 0.5) * phase.spreadY * 1.45;
    const startZ = zCenter + (seeded(baseSeed + 5) - 0.5) * 180;

    const pts = [];
    let px = startX;
    let py = startY;
    let pz = startZ;

    for (let i = 0; i < pointCount; i += 1) {
      const dx = (seeded(baseSeed + i * 11 + 10) - 0.5) * phase.spreadX * 0.24;
      const dy = (seeded(baseSeed + i * 13 + 14) - 0.5) * phase.spreadY * 0.26;
      const dz = -lerp(34, 90, seeded(baseSeed + i * 17 + 19));

      px += dx;
      py += dy;
      pz += dz;

      pts.push({
        x: px,
        y: py,
        z: pz,
        size: lerp(0.28, 0.7, seeded(baseSeed + i * 23 + 22)),
        alpha: lerp(0.25, 0.52, seeded(baseSeed + i * 29 + 28)),
        badge:
          seeded(baseSeed + i * 31 + 33) > 0.84
            ? Math.floor(1 + seeded(baseSeed + i * 37 + 39) * 7)
            : null,
      });
    }

    trails.push(pts);
  }

  return trails;
}

function buildPhaseWorlds() {
  return PHASES.map((phase, phaseIndex) => {
    const zCenter = -phaseIndex * PHASE_DEPTH;
    const cloudCount = 300 + phase.nodes.length * 72;

    const cloudNodes = Array.from({ length: cloudCount }, (_, i) => {
      const s1 = seeded(phaseIndex * 10000 + i * 1.17 + 1);
      const s2 = seeded(phaseIndex * 10000 + i * 2.31 + 7);
      const s3 = seeded(phaseIndex * 10000 + i * 3.91 + 17);
      const s4 = seeded(phaseIndex * 10000 + i * 4.83 + 29);

      const angle = s1 * Math.PI * 2;
      const radial = Math.pow(s2, 1.6);

      const localX =
        Math.cos(angle) * phase.spreadX * radial +
        Math.sin(angle * (2 + phase.turbulence * 4)) * phase.spreadX * 0.16 +
        (s4 - 0.5) * phase.spreadX * 0.16;

      const localY =
        Math.sin(angle) * phase.spreadY * radial * lerp(0.74, 1.22, s3) +
        Math.sin((s3 - 0.5) * Math.PI) * phase.spreadY * 0.2 * phase.turbulence;

      const localZ =
        zCenter +
        (s3 - 0.5) * PHASE_DEPTH * 0.74 +
        radial * PHASE_DEPTH * 0.18;

      return {
        x: localX,
        y: localY,
        z: localZ,
        size: lerp(0.2, 0.62, 1 - radial),
        brightness: lerp(0.12, 0.36, 1 - radial),
      };
    });

    const cloudEdges = [];
    for (let i = 0; i < cloudNodes.length; i += 1) {
      const distances = [];
      for (let j = 0; j < cloudNodes.length; j += 1) {
        if (i === j) continue;
        const dx = cloudNodes[i].x - cloudNodes[j].x;
        const dy = cloudNodes[i].y - cloudNodes[j].y;
        const dz = cloudNodes[i].z - cloudNodes[j].z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        distances.push({ j, d });
      }
      distances.sort((a, b) => a.d - b.d);
      for (let k = 0; k < 3; k += 1) {
        const candidate = distances[k];
        if (candidate && candidate.j > i && candidate.d < 96) {
          cloudEdges.push([i, candidate.j]);
        }
      }
    }

    const highlighted = phase.nodes.map((node, idx) => {
      const rankT = idx / Math.max(phase.nodes.length - 1, 1);
      const laneX = lerp(-phase.spreadX * 0.9, phase.spreadX * 0.96, rankT);
      const laneY = (seeded(phaseIndex * 300 + idx * 27 + 90) - 0.5) * phase.spreadY * 1.2;
      const laneZ = zCenter + (seeded(phaseIndex * 500 + idx * 33 + 190) - 0.5) * 180;

      return {
        ...node,
        x: laneX,
        y: laneY,
        z: laneZ,
        size: lerp(1.55, 0.8, rankT),
      };
    });

    return {
      ...phase,
      zCenter,
      cloudNodes,
      cloudEdges,
      highlighted,
      graphTrails: buildGraphTrails(phase, phaseIndex, zCenter),
    };
  });
}

export default function Experience() {
  const canvasRef = useRef(null);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scrollY, setScrollY] = useState(0);

  const worlds = useMemo(() => buildPhaseWorlds(), []);
  const dust = useMemo(() => buildDust(), []);

  useEffect(() => {
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    const onScroll = () => {
      setScrollY(window.scrollY);
    };

    onResize();
    onScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const totalScrollable = Math.max(viewport.height * (PHASES.length - 1), 1);
    const totalDepth = (PHASES.length - 1) * PHASE_DEPTH;

    let raf = 0;
    const start = performance.now();

    const drawGlow = (x, y, radius, alpha) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBadge = (x, y, n, alpha, tint) => {
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${tint},${0.88 * alpha})`;
      ctx.fill();

      ctx.fillStyle = `rgba(48,18,42,${0.95 * alpha})`;
      ctx.font = "700 10px Inter, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(n), x, y + 0.5);
    };

    const draw = (now) => {
      const t = (now - start) * 0.001;
      ctx.clearRect(0, 0, viewport.width, viewport.height);

      const progress = clamp(scrollY / totalScrollable, 0, 1);
      const camera = {
        x: Math.sin(t * 0.14) * 12 + Math.sin(progress * Math.PI * 2.5) * 10,
        y: Math.cos(t * 0.11) * 7 + Math.sin(progress * Math.PI * 3.8) * 6,
        z: -progress * totalDepth,
      };

      

      for (let i = 0; i < dust.length; i += 1) {
        const d = dust[i];
        const p = projectPoint(
          {
            x: d.x + Math.sin(t * 0.06 + i) * 4,
            y: d.y + Math.cos(t * 0.05 + i * 0.2) * 3,
            z: d.z,
          },
          camera,
          viewport.width,
          viewport.height
        );
        if (!p) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.alpha})`;
        ctx.fill();
      }

      let activeWorld = worlds[0];
      let minDist = Infinity;

      for (let w = 0; w < worlds.length; w += 1) {
        const world = worlds[w];
        const phaseDistance = Math.abs(world.zCenter - camera.z);
        if (phaseDistance < minDist) {
          minDist = phaseDistance;
          activeWorld = world;
        }
        if (phaseDistance > PHASE_DEPTH * 1.75) continue;

        const proximityFade = clamp(1 - phaseDistance / (PHASE_DEPTH * 1.75), 0.12, 1);

        const projectedCloud = new Array(world.cloudNodes.length);
        for (let i = 0; i < world.cloudNodes.length; i += 1) {
          const node = world.cloudNodes[i];
          const p = projectPoint(
            {
              x: node.x + Math.sin(t * 0.08 + i * 0.03 + w) * 3.5 * world.turbulence,
              y: node.y + Math.cos(t * 0.07 + i * 0.02 + w) * 3 * world.turbulence,
              z: node.z,
            },
            camera,
            viewport.width,
            viewport.height
          );
          if (!p) continue;

          projectedCloud[i] = {
            ...p,
            size: clamp(node.size, 0.22, 0.62),
            alpha: clamp(node.brightness * proximityFade * 1.2, 0.08, 0.34),
          };
        }

        for (let e = 0; e < world.cloudEdges.length; e += 1) {
          const [aIdx, bIdx] = world.cloudEdges[e];
          const a = projectedCloud[aIdx];
          const b = projectedCloud[bIdx];
          if (!a || !b) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${clamp(
            0.02 + proximityFade * 0.03,
            0.02,
            0.05
          )})`;
          ctx.lineWidth = 0.38;
          ctx.stroke();
        }

        for (let i = 0; i < world.graphTrails.length; i += 1) {
          const trail = world.graphTrails[i];
          const projectedTrail = [];

          for (let j = 0; j < trail.length; j += 1) {
            const pt = trail[j];
            const p = projectPoint(
              {
                x: pt.x + Math.sin(t * 0.05 + i * 0.7 + j) * 2.2,
                y: pt.y + Math.cos(t * 0.045 + i * 0.4 + j) * 1.8,
                z: pt.z,
              },
              camera,
              viewport.width,
              viewport.height
            );
            if (p) projectedTrail.push({ ...p, source: pt });
          }

          if (projectedTrail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(projectedTrail[0].x, projectedTrail[0].y);
            for (let j = 1; j < projectedTrail.length; j += 1) {
              ctx.lineTo(projectedTrail[j].x, projectedTrail[j].y);
            }
            ctx.strokeStyle = `rgba(255,255,255,${clamp(
              0.08 + proximityFade * 0.08,
              0.08,
              0.14
            )})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }

          for (let j = 0; j < projectedTrail.length; j += 1) {
            const p = projectedTrail[j];
            const r = clamp(p.source.size, 0.32, 0.8);

            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${clamp(
              p.source.alpha * proximityFade * 1.1,
              0.24,
              0.58
            )})`;
            ctx.fill();

            if (p.source.badge && j < 2) {
              drawBadge(p.x, p.y, p.source.badge, proximityFade, world.tint);
            }
          }
        }

        for (let i = 0; i < projectedCloud.length; i += 1) {
          const p = projectedCloud[i];
          if (!p) continue;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.fill();
        }

        for (let i = 0; i < world.highlighted.length; i += 1) {
          const node = world.highlighted[i];
          const p = projectPoint(node, camera, viewport.width, viewport.height);
          if (!p) continue;

          const size = clamp(node.size, 0.62, 1.55);
          const alpha = clamp(0.44 + proximityFade * 0.42, 0.42, 0.9);

          drawGlow(p.x, p.y, size * 4.2, alpha * 0.08);
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();

          if (proximityFade > 0.25) {
            ctx.fillStyle = `rgba(${world.tint},${0.84 * proximityFade})`;
            ctx.font = `600 ${Math.max(10, 17 - i)}px Inter, Arial, sans-serif`;
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            ctx.fillText(node.label, p.x + 10, p.y - 4);

            ctx.fillStyle = `rgba(${world.tint},${0.62 * proximityFade})`;
            ctx.font = "500 10px Inter, Arial, sans-serif";
            ctx.fillText(`#${node.rank}`, p.x + 10, p.y + 10);
          }
        }
      }

      ctx.fillStyle = `rgba(${activeWorld.tint},0.1)`;
      ctx.font = `700 ${Math.min(140, viewport.width * 0.12)}px Inter, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(activeWorld.title, viewport.width * 0.5, viewport.height * 0.72);

      const vignette = ctx.createRadialGradient(
        viewport.width / 2,
        viewport.height / 2,
        viewport.width * 0.18,
        viewport.width / 2,
        viewport.height / 2,
        viewport.width * 0.84
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.22)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, viewport.width, viewport.height);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [viewport, scrollY, worlds, dust]);

  return (
    <div className="experience">
      <canvas ref={canvasRef} className="experience__canvas" />
      <div
        className="experience__scrollSpace"
        style={{ height: `${viewport.height * PHASES.length}px` }}
      >
        {PHASES.map((phase) => (
          <section key={phase.id} style={{ height: `${viewport.height}px` }} />
        ))}
      </div>
    </div>
  );
}