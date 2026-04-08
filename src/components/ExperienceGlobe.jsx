import React, { useEffect, useMemo, useRef } from "react";
import "./ExperienceGlobe.css";

const TERRITORIES = [
  {
    id: "identity",
    center: { lat: 46, lon: -105 },
    rx: 0.24,
    ry: 0.18,
    colorA: [116, 130, 92],
    colorB: [164, 174, 128],
    seed: 11,
    blocks: [
      { x: -0.18, y: -0.08, tint: [144, 160, 120] },
      { x: 0.12, y: -0.14, tint: [176, 184, 138] },
      { x: -0.1, y: 0.14, tint: [132, 150, 114] },
      { x: 0.16, y: 0.1, tint: [154, 168, 128] },
    ],
  },
  {
    id: "healthcare",
    center: { lat: 34, lon: 90 },
    rx: 0.3,
    ry: 0.18,
    colorA: [104, 124, 92],
    colorB: [154, 172, 130],
    seed: 23,
    blocks: [
      { x: -0.2, y: -0.06, tint: [128, 146, 112] },
      { x: 0.18, y: -0.1, tint: [172, 182, 136] },
      { x: -0.08, y: 0.12, tint: [138, 156, 120] },
      { x: 0.08, y: 0.06, tint: [158, 172, 132] },
      { x: 0.02, y: -0.18, tint: [120, 140, 108] },
    ],
  },
  {
    id: "symptoms",
    center: { lat: 8, lon: 20 },
    rx: 0.18,
    ry: 0.22,
    colorA: [118, 130, 82],
    colorB: [172, 176, 124],
    seed: 37,
    blocks: [
      { x: -0.12, y: -0.1, tint: [150, 164, 118] },
      { x: 0.1, y: -0.08, tint: [176, 168, 116] },
      { x: -0.08, y: 0.12, tint: [132, 152, 116] },
      { x: 0.08, y: 0.12, tint: [156, 166, 122] },
      { x: 0.0, y: 0.0, tint: [142, 158, 120] },
    ],
  },
  {
    id: "relationships",
    center: { lat: 52, lon: 16 },
    rx: 0.12,
    ry: 0.09,
    colorA: [126, 134, 98],
    colorB: [180, 184, 140],
    seed: 49,
    blocks: [
      { x: -0.06, y: -0.04, tint: [150, 162, 124] },
      { x: 0.06, y: -0.02, tint: [174, 180, 138] },
      { x: -0.02, y: 0.05, tint: [138, 152, 118] },
      { x: 0.05, y: 0.04, tint: [160, 170, 132] },
    ],
  },
  {
    id: "work",
    center: { lat: -24, lon: 136 },
    rx: 0.14,
    ry: 0.1,
    colorA: [146, 118, 82],
    colorB: [194, 164, 120],
    seed: 61,
    blocks: [
      { x: -0.06, y: -0.02, tint: [166, 142, 106] },
      { x: 0.06, y: -0.03, tint: [188, 160, 118] },
      { x: -0.02, y: 0.05, tint: [156, 132, 98] },
      { x: 0.04, y: 0.04, tint: [176, 150, 114] },
    ],
  },
  {
    id: "emotional",
    center: { lat: -18, lon: -62 },
    rx: 0.14,
    ry: 0.22,
    colorA: [102, 122, 92],
    colorB: [152, 170, 130],
    seed: 79,
    blocks: [
      { x: -0.05, y: -0.12, tint: [126, 146, 112] },
      { x: 0.06, y: -0.04, tint: [158, 170, 128] },
      { x: -0.03, y: 0.08, tint: [142, 160, 124] },
      { x: 0.05, y: 0.14, tint: [168, 160, 120] },
    ],
  },
  {
    id: "unknown",
    center: { lat: -74, lon: 10 },
    rx: 0.34,
    ry: 0.06,
    colorA: [182, 184, 182],
    colorB: [234, 236, 234],
    seed: 97,
    blocks: [
      { x: -0.14, y: 0.0, tint: [210, 212, 210] },
      { x: 0.0, y: -0.01, tint: [228, 230, 228] },
      { x: 0.14, y: 0.01, tint: [198, 200, 198] },
    ],
  },
];

const OCEAN_DOTS = Array.from({ length: 90 }, (_, i) => ({
  lat: ((Math.sin(i * 18.13) * 0.5 + 0.5) * 150) - 75,
  lon: ((Math.cos(i * 14.31) * 0.5 + 0.5) * 360) - 180,
  size: 1 + ((i * 7) % 3),
  alpha: 0.08 + ((i * 17) % 10) / 100,
}));

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function degToRad(d) {
  return (d * Math.PI) / 180;
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(a, b, t) {
  return [
    Math.round(mix(a[0], b[0], t)),
    Math.round(mix(a[1], b[1], t)),
    Math.round(mix(a[2], b[2], t)),
  ];
}

function fract(x) {
  return x - Math.floor(x);
}

function hash2(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 17.13) * 43758.5453123);
}

function smoothstep(a, b, x) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function valueNoise2D(x, y, seed = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const v00 = hash2(xi, yi, seed);
  const v10 = hash2(xi + 1, yi, seed);
  const v01 = hash2(xi, yi + 1, seed);
  const v11 = hash2(xi + 1, yi + 1, seed);

  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const a = mix(v00, v10, u);
  const b = mix(v01, v11, u);

  return mix(a, b, v);
}

function fbm(x, y, seed = 0, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;

  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise2D(x * freq, y * freq, seed + i * 29.7) * amp;
    freq *= 2;
    amp *= 0.5;
  }

  return sum;
}

function latLonToSphere(latDeg, lonDeg, rotLon, rotLat) {
  const phi = degToRad(latDeg);
  const theta = degToRad(lonDeg) + rotLon;

  let x = Math.cos(phi) * Math.sin(theta);
  let y = Math.sin(phi);
  let z = Math.cos(phi) * Math.cos(theta);

  const cosLat = Math.cos(rotLat);
  const sinLat = Math.sin(rotLat);

  const y2 = y * cosLat - z * sinLat;
  const z2 = y * sinLat + z * cosLat;

  return { x, y: y2, z: z2, visible: z2 > 0 };
}

function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function buildStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    x: hash2(i * 1.27, i * 2.91, 10),
    y: hash2(i * 3.11, i * 1.49, 22),
    size: 0.4 + hash2(i * 5.17, i * 4.71, 33) * 2.2,
    alpha: 0.14 + hash2(i * 2.31, i * 7.17, 44) * 0.34,
  }));
}

function territoryStrength(latDeg, lonDeg, t) {
  const lonScale = Math.max(0.35, Math.cos(degToRad(t.center.lat)));
  const dx = (lonDeg - t.center.lon) / (t.rx * 180 * lonScale);
  const dy = (latDeg - t.center.lat) / (t.ry * 90);

  const dist = Math.sqrt(dx * dx + dy * dy);
  const ang = Math.atan2(dy, dx);

  const edgeNoise =
    (fbm(dx * 3.2 + 4, dy * 3.4 + 8, t.seed, 4) - 0.5) * 0.18 +
    (fbm(ang * 1.6 + 11, dist * 3.1 + 6, t.seed + 20, 3) - 0.5) * 0.16;

  return 1 - smoothstep(0.78 + edgeNoise, 1.05 + edgeNoise, dist);
}

function bestSubregion(dx, dy, territory) {
  if (!territory.blocks?.length) return null;

  let best = Infinity;
  let second = Infinity;
  let selected = null;

  territory.blocks.forEach((b, i) => {
    const jx = (fbm(dx * 5 + i, dy * 5 + i, territory.seed + i * 17, 2) - 0.5) * 0.06;
    const jy = (fbm(dx * 4 + i, dy * 4 + i, territory.seed + i * 13, 2) - 0.5) * 0.06;
    const ddx = dx - (b.x + jx);
    const ddy = dy - (b.y + jy);
    const d = Math.sqrt(ddx * ddx + ddy * ddy);

    if (d < best) {
      second = best;
      best = d;
      selected = b;
    } else if (d < second) {
      second = d;
    }
  });

  return {
    tint: selected.tint,
    edge: smoothstep(0.0, 0.08, second - best),
  };
}

export default function ExperienceGlobe() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stars = useMemo(() => buildStars(140), []);

  const stateRef = useRef({
    rotationLon: degToRad(-10),
    rotationLat: degToRad(-8),
    zoom: 1,
    dragging: false,
    lastX: 0,
    lastY: 0,
    width: 0,
    height: 0,
    dpr: 1,
    rafId: 0,
    needsRender: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const st = stateRef.current;
      st.width = wrap.clientWidth;
      st.height = wrap.clientHeight;
      st.dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(st.width * st.dpr);
      canvas.height = Math.floor(st.height * st.dpr);
      canvas.style.width = `${st.width}px`;
      canvas.style.height = `${st.height}px`;

      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      st.needsRender = true;
      requestDraw();
    }

    function drawBackground() {
      const st = stateRef.current;
      ctx.clearRect(0, 0, st.width, st.height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, st.width, st.height);

      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x * st.width, s.y * st.height, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,220,245,${s.alpha})`;
        ctx.fill();
      }
    }

    function drawGlobe() {
      const st = stateRef.current;
      const cx = st.width * 0.5;
      const cy = st.height * 0.52;
      const r = Math.min(st.width, st.height) * 0.44 * st.zoom;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const res = st.dragging ? 220 : 320;
      const light = normalize([-0.68, -0.34, 0.64]);
      const cell = (r * 2) / res;

      for (let gy = 0; gy < res; gy += 1) {
        for (let gx = 0; gx < res; gx += 1) {
          const px = cx - r + gx * cell + cell * 0.5;
          const py = cy - r + gy * cell + cell * 0.5;

          const nx = (px - cx) / r;
          const ny = (py - cy) / r;
          const rr = nx * nx + ny * ny;
          if (rr > 1) continue;

          const z = Math.sqrt(1 - rr);
          const localLon = Math.atan2(nx, z);
          const localLat = Math.asin(clamp(-ny, -1, 1));

          const lonDeg = ((localLon - st.rotationLon) * 180) / Math.PI;
          const latDeg = ((localLat + st.rotationLat) * 180) / Math.PI;

          const wash1 = fbm(lonDeg * 0.03 + 12, latDeg * 0.03 + 20, 700, 4);
          const wash2 = fbm(lonDeg * 0.09 + 42, latDeg * 0.08 + 5, 770, 3);
          const bloom = smoothstep(0.5, 0.82, wash1 * 0.72 + wash2 * 0.28);

          let color = mixColor([4, 14, 30], [18, 48, 88], wash1);
          color = mixColor(color, [28, 76, 128], bloom * 0.32);

          let best = 0;
          let chosen = null;

          for (const t of TERRITORIES) {
            const s = territoryStrength(latDeg, lonDeg, t);
            if (s > best) {
              best = s;
              chosen = t;
            }
          }

          if (chosen && best > 0.02) {
            const lonScale = Math.max(0.35, Math.cos(degToRad(chosen.center.lat)));
            const dx = (lonDeg - chosen.center.lon) / (chosen.rx * 180 * lonScale);
            const dy = (latDeg - chosen.center.lat) / (chosen.ry * 90);

            const topo1 = fbm(lonDeg * 0.06 + 9, latDeg * 0.06 + 13, chosen.seed + 50, 4);
            const topo2 = fbm(lonDeg * 0.18 + 21, latDeg * 0.14 + 4, chosen.seed + 90, 3);
            const topo = topo1 * 0.68 + topo2 * 0.32;

            let land = mixColor(chosen.colorA, chosen.colorB, topo);

            const sub = bestSubregion(dx, dy, chosen);
            if (sub) {
              land = mixColor(land, sub.tint, 0.34);
              land = mixColor(land, [52, 58, 60], (1 - sub.edge) * 0.12);
            }

            const ridge = smoothstep(0.56, 0.82, topo);
            const blotch = fbm(lonDeg * 0.2 + 8, latDeg * 0.18 + 14, chosen.seed + 140, 3);

            land = [
              clamp(Math.round(land[0] + ridge * 18 + blotch * 7), 0, 255),
              clamp(Math.round(land[1] + ridge * 14 + blotch * 5), 0, 255),
              clamp(Math.round(land[2] + ridge * 6 + blotch * 4), 0, 255),
            ];

            color = mixColor(color, land, clamp(best * 0.95, 0, 1));
          }

          const lambert = clamp(dot([nx, -ny, z], light), 0, 1);
          const rim = Math.pow(1 - z, 1.7);

          color = [
            clamp(Math.round(color[0] + lambert * 8 + rim * 10), 0, 255),
            clamp(Math.round(color[1] + lambert * 10 + rim * 18), 0, 255),
            clamp(Math.round(color[2] + lambert * 14 + rim * 28), 0, 255),
          ];

          ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          ctx.fillRect(px - cell * 0.56, py - cell * 0.56, cell * 1.12, cell * 1.12);
        }
      }

      for (const d of OCEAN_DOTS) {
        const p = latLonToSphere(d.lat, d.lon, st.rotationLon, st.rotationLat);
        if (!p.visible) continue;

        const x = cx + p.x * r;
        const y = cy - p.y * r;
        const size = d.size * (0.65 + p.z * 0.35);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 210, ${d.alpha})`;
        ctx.fill();
      }

      const shadow = ctx.createRadialGradient(
        cx + r * 0.24,
        cy + r * 0.18,
        r * 0.1,
        cx,
        cy,
        r * 1.03
      );
      shadow.addColorStop(0, "rgba(0,0,0,0)");
      shadow.addColorStop(1, "rgba(0,0,0,0.46)");

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shadow;
      ctx.fill();

      const highlight = ctx.createRadialGradient(
        cx - r * 0.35,
        cy - r * 0.36,
        r * 0.02,
        cx - r * 0.18,
        cy - r * 0.2,
        r * 0.78
      );
      highlight.addColorStop(0, "rgba(255,255,255,0.08)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = "rgba(80, 110, 165, 0.14)";
      ctx.stroke();
    }

    function draw() {
      const st = stateRef.current;
      st.rafId = 0;
      if (!st.needsRender) return;
      st.needsRender = false;

      drawBackground();
      drawGlobe();
    }

    function requestDraw() {
      const st = stateRef.current;
      if (st.rafId) return;
      st.rafId = requestAnimationFrame(draw);
    }

    function onPointerDown(e) {
      const st = stateRef.current;
      st.dragging = true;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      canvas.classList.add("dragging");
    }

    function onPointerMove(e) {
      const st = stateRef.current;
      if (!st.dragging) return;

      const dx = e.clientX - st.lastX;
      const dy = e.clientY - st.lastY;

      st.rotationLon += dx * 0.0052;
      st.rotationLat += dy * 0.0042;
      st.rotationLat = clamp(st.rotationLat, -0.92, 0.92);

      st.lastX = e.clientX;
      st.lastY = e.clientY;
      st.needsRender = true;
      requestDraw();
    }

    function onPointerUp() {
      const st = stateRef.current;
      st.dragging = false;
      canvas.classList.remove("dragging");
      st.needsRender = true;
      requestDraw();
    }

    function onWheel(e) {
      e.preventDefault();
      const st = stateRef.current;
      st.zoom = clamp(st.zoom - e.deltaY * 0.0008, 0.84, 1.42);
      st.needsRender = true;
      requestDraw();
    }

    resize();

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      const st = stateRef.current;
      if (st.rafId) cancelAnimationFrame(st.rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [stars]);

  return (
    <div className="experience-globe-page">
      <div className="experience-globe-wrap" ref={wrapRef}>
        <canvas ref={canvasRef} className="experience-globe-canvas" />
      </div>
    </div>
  );
}