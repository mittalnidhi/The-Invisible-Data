import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TITLE_ASCII } from "../pages/titleAscii";
import { ASCII_FRAMES } from "../pages/asciiFrames";
import "./LandingJourney.css";

const IMAGE_DURATION = 2.2;
const FULL_IMAGE_LOOP_TIME = ASCII_FRAMES.length * IMAGE_DURATION;

const CAPTION_LINE_1 = "Mapping the perimenopausal data gap";
const CAPTION_LINE_2 = "in women’s health";

const INTRO_TEXT =
  "Perimenopause is a midlife women's health issue affecting millions of women across the globe, yet health education and research in this phase is limited. Even when this phase is studied, it does not capture lived experiences of women.";

export default function LandingJourney() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [titleDone, setTitleDone] = useState(false);
  const [captionLine1, setCaptionLine1] = useState("");
  const [captionLine2, setCaptionLine2] = useState("");
  const [mode, setMode] = useState("title");
  const [introProgress, setIntroProgress] = useState(0);
  const [showNav, setShowNav] = useState(false);

  const modeRef = useRef("title");
  const animationStartRef = useRef(null);
  const shatterStartRef = useRef(null);
  const navStartRef = useRef(null);
  const fadeStartRef = useRef(null);

  const titleParticlesRef = useRef([]);
  const hasNavigatedRef = useRef(false);
  const touchStartYRef = useRef(null);

  const captionLine1Ref = useRef("");
  const captionLine2Ref = useRef("");

  useEffect(() => {
    captionLine1Ref.current = captionLine1;
  }, [captionLine1]);

  useEffect(() => {
    captionLine2Ref.current = captionLine2;
  }, [captionLine2]);

  const restartLanding = (e) => {
    e.stopPropagation();
    window.location.href = "/";
  };

  useEffect(() => {
    if (mode !== "intro") return;

    const updateProgress = (delta) => {
      setIntroProgress((prev) => {
        const next = prev + delta;
        const clamped = Math.min(Math.max(next, 0), 1);

        if (clamped >= 1 && !hasNavigatedRef.current) {
          hasNavigatedRef.current = true;

          setTimeout(() => {
            navigate("/about", { state: { fromLandingCollapse: true } });
          }, 900);
        }

        return clamped;
      });
    };

    const handleWheel = (e) => {
      e.preventDefault();
      updateProgress(e.deltaY * 0.0012);
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (touchStartYRef.current === null) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY;

      e.preventDefault();
      updateProgress(deltaY * 0.0022);

      touchStartYRef.current = currentY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mode, navigate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;
    let typedColumns = 0;
    let time = 0;

    const prepareAscii = () => {
      const rawLines = TITLE_ASCII.split("\n").filter(
        (line) => line.replace(/\s/g, "").length > 8
      );

      const minIndex = Math.min(
        ...rawLines.map((line) => {
          const first = line.search(/\S/);
          return first === -1 ? 0 : first;
        })
      );

      const maxIndex = Math.max(
        ...rawLines.map((line) => {
          const last = line.search(/\s*$/);
          return last;
        })
      );

      let cropped = rawLines.map((line) =>
        line
          .slice(minIndex, maxIndex)
          .replace(/[|:]/g, " ")
          .replace(/[=]/g, "+")
      );

      const leftCrop = Math.min(
        ...cropped.map((line) => {
          const first = line.search(/[+]/);
          return first === -1 ? 0 : first;
        })
      );

      const rightCrop = Math.max(
        ...cropped.map((line) => line.lastIndexOf("+"))
      );

      return cropped.map((line) => line.slice(leftCrop, rightCrop + 1));
    };

    const lines = prepareAscii();
    const longestLine = Math.max(...lines.map((line) => line.length));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const getTitleLayout = () => {
      const sidePadding = 24;
      const topOffset = -40;

      let fontSize = 18;
      ctx.font = `${fontSize}px "Cascadia Code", "Courier New", monospace`;

      while (
        ctx.measureText(lines[0]).width < canvas.width - sidePadding * 2 &&
        fontSize < 32
      ) {
        fontSize += 0.5;
        ctx.font = `${fontSize}px "Cascadia Code", "Courier New", monospace`;
      }

      while (
        ctx.measureText(lines[0]).width > canvas.width - sidePadding * 2 &&
        fontSize > 5
      ) {
        fontSize -= 0.5;
        ctx.font = `${fontSize}px "Cascadia Code", "Courier New", monospace`;
      }

      const lineHeight = fontSize * 1.08;
      const totalHeight = lines.length * lineHeight;

      return {
        fontSize,
        lineHeight,
        startX: sidePadding,
        startY: canvas.height / 2 - totalHeight / 2 + topOffset,
        totalHeight,
      };
    };

    const createTitleParticles = () => {
      const { fontSize, lineHeight, startX, startY } = getTitleLayout();
      const charW = fontSize * 0.6;
      const particles = [];

      lines.forEach((line, i) => {
        const visibleLine = line.slice(0, Math.floor(typedColumns));

        for (let x = 0; x < visibleLine.length; x++) {
          const ch = visibleLine[x];
          if (ch === " ") continue;

          particles.push({
            ch,
            x: startX + x * charW,
            y: startY + i * lineHeight,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 3,
            bounce: Math.random() * 0.45 + 0.35,
            size: fontSize,
            floor: canvas.height - 40 - Math.random() * 120,
          });
        }
      });

      const captionFontSize = 28;
      const captionCharW = captionFontSize * 0.68;
      const captionY1 = canvas.height - 135;
      const captionY2 = canvas.height - 95;

      const currentCaptionLine1 = captionLine1Ref.current;
      const currentCaptionLine2 = captionLine2Ref.current;

      currentCaptionLine1.split("").forEach((ch, i) => {
        if (ch === " ") return;

        particles.push({
          ch,
          x:
            canvas.width / 2 -
            (currentCaptionLine1.length * captionCharW) / 2 +
            i * captionCharW,
          y: captionY1,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 5 + 3,
          bounce: Math.random() * 0.45 + 0.35,
          size: captionFontSize,
          floor: canvas.height - 35 - Math.random() * 120,
        });
      });

      currentCaptionLine2.split("").forEach((ch, i) => {
        if (ch === " ") return;

        particles.push({
          ch,
          x:
            canvas.width / 2 -
            (currentCaptionLine2.length * captionCharW) / 2 +
            i * captionCharW,
          y: captionY2,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 5 + 3,
          bounce: Math.random() * 0.45 + 0.35,
          size: captionFontSize,
          floor: canvas.height - 35 - Math.random() * 120,
        });
      });

      titleParticlesRef.current = particles;
    };

    window.__startLandingShatter = createTitleParticles;

    const drawTitle = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { fontSize, lineHeight, startX, startY, totalHeight } =
        getTitleLayout();

      typedColumns = Math.min(longestLine, typedColumns + 1.6);

      if (typedColumns >= longestLine - 1) {
        setTitleDone(true);
      }

      ctx.font = `${fontSize}px "Cascadia Code", "Courier New", monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(244,240,232,0.96)";
      ctx.globalAlpha = 0.95;

      lines.forEach((line, i) => {
        const visibleLine = line.slice(0, Math.floor(typedColumns));
        const y = startY + i * lineHeight;

        ctx.fillText(visibleLine, startX, y);

        if (
          typedColumns > longestLine * 0.55 &&
          time % 45 > 35 &&
          i % 3 === 0
        ) {
          ctx.globalAlpha = 0.75;
          ctx.fillText(visibleLine, startX + 14, y);
          ctx.globalAlpha = 0.95;
        }

        if (
          typedColumns > longestLine * 0.75 &&
          time % 60 > 50 &&
          i % 4 === 0
        ) {
          ctx.globalAlpha = 0.6;
          ctx.fillText(visibleLine, startX - 18, y + 1);
          ctx.globalAlpha = 0.95;
        }
      });

      if (typedColumns > longestLine * 0.8 && time % 80 > 62) {
        for (let i = 0; i < 5; i++) {
          const sliceY = startY + Math.random() * totalHeight;
          const sliceH = Math.random() * 8 + 3;
          const shift = (Math.random() - 0.5) * 40;

          const imageData = ctx.getImageData(0, sliceY, canvas.width, sliceH);
          ctx.putImageData(imageData, shift, sliceY);
        }
      }

      ctx.globalAlpha = 1;
      time += 1;
    };

    const drawShatter = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = (performance.now() - shatterStartRef.current) / 1000;

      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(244,240,232,0.96)";

      titleParticlesRef.current.forEach((p) => {
        p.vy += 0.55;
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > p.floor) {
          p.y = p.floor;
          p.vy *= -p.bounce;
          p.vx *= 0.94;
        }

        ctx.font = `${p.size}px "Cascadia Code", "Courier New", monospace`;
        ctx.globalAlpha = Math.max(0, 1 - elapsed / 2.2);
        ctx.fillText(p.ch, p.x, p.y);
      });

      ctx.globalAlpha = 1;

      if (elapsed > 2.2) {
        modeRef.current = "navIntro";
        setMode("navIntro");
        setShowNav(true);
        navStartRef.current = performance.now();
        setCaptionLine1("");
        setCaptionLine2("");
      }
    };

    const drawNavIntro = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = (performance.now() - navStartRef.current) / 1000;

      if (elapsed > 3.6) {
        modeRef.current = "animation";
        setMode("animation");
        animationStartRef.current = performance.now();
      }
    };

    const drawWomenAnimation = () => {
      const animationT = (performance.now() - animationStartRef.current) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (animationT >= FULL_IMAGE_LOOP_TIME) {
        modeRef.current = "lastImageFade";
        setMode("lastImageFade");
        fadeStartRef.current = performance.now();
        setCaptionLine1("");
        setCaptionLine2("");
        return;
      }

      const index =
        Math.floor(animationT / IMAGE_DURATION) % ASCII_FRAMES.length;

      const isLastFrame = index === ASCII_FRAMES.length - 1;

      const nextIndex = isLastFrame
        ? index
        : Math.floor(animationT / IMAGE_DURATION + 1) % ASCII_FRAMES.length;

      const localT = (animationT % IMAGE_DURATION) / IMAGE_DURATION;

      setCaptionLine1(ASCII_FRAMES[index].label || "");
      setCaptionLine2("");

      drawAscii({
        ctx,
        w: canvas.width,
        h: canvas.height,
        t: animationT,
        localT,
        current: ASCII_FRAMES[index].art,
        next: ASCII_FRAMES[nextIndex].art,
      });
    };

    const drawLastImageFade = () => {
      const elapsed = (performance.now() - fadeStartRef.current) / 1000;
      const lastFrame = ASCII_FRAMES[ASCII_FRAMES.length - 1];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawAscii({
        ctx,
        w: canvas.width,
        h: canvas.height,
        t: elapsed * 3,
        localT: 0.88,
        current: lastFrame.art,
        next: lastFrame.art,
      });

      ctx.fillStyle = "#323741";
      ctx.globalAlpha = Math.min(1, elapsed / 2.8);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      if (elapsed > 2.8) {
        modeRef.current = "intro";
        setMode("intro");
      }
    };

    const draw = () => {
      if (modeRef.current === "title") drawTitle();
      if (modeRef.current === "shatter") drawShatter();
      if (modeRef.current === "navIntro") drawNavIntro();
      if (modeRef.current === "animation") drawWomenAnimation();
      if (modeRef.current === "lastImageFade") drawLastImageFade();

      if (modeRef.current === "intro") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      delete window.__startLandingShatter;
    };
  }, [navigate]);

  useEffect(() => {
    if (!titleDone || modeRef.current !== "title") return;

    let i = 0;
    let secondTimer;

    const firstTimer = setInterval(() => {
      i += 1;
      setCaptionLine1(CAPTION_LINE_1.slice(0, i));

      if (i >= CAPTION_LINE_1.length) {
        clearInterval(firstTimer);

        let j = 0;
        secondTimer = setInterval(() => {
          j += 1;
          setCaptionLine2(CAPTION_LINE_2.slice(0, j));

          if (j >= CAPTION_LINE_2.length) {
            clearInterval(secondTimer);
          }
        }, 85);
      }
    }, 85);

    return () => {
      clearInterval(firstTimer);
      clearInterval(secondTimer);
    };
  }, [titleDone]);

  const handleClick = (e) => {
    if (e.target.closest(".nav")) return;
    if (modeRef.current !== "title") return;

    window.__startLandingShatter?.();

    modeRef.current = "shatter";
    setMode("shatter");
    shatterStartRef.current = performance.now();
  };

  const textValue = Math.round(190 + introProgress * 65);

  return (
    <main
      className={`landing ${mode}`}
      onClick={handleClick}
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      <canvas ref={canvasRef} />

      {showNav && mode !== "title" && (
        <nav className="nav nav-typing">
          <button className="nav-button nav-title-button" onClick={restartLanding}>
            <span className="type-nav type-title">THE INVISIBLE DATA</span>
          </button>

          <div className="nav-right">
            <button
              className="nav-button nav-about-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/about");
              }}
            >
              <span className="type-nav type-about">ABOUT</span>
            </button>

            <button
              className="nav-button nav-path-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/path");
              }}
            >
              <span className="type-nav type-path">PATH</span>
            </button>

            <button
              className="nav-button nav-dear-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/dear-peri");
              }}
            >
              <span className="type-nav type-dear">DEAR PERI</span>
            </button>
          </div>
        </nav>
      )}

      {mode === "title" && (
        <div
          className="cursor-tip"
          style={{
            left: mouse.x + 16,
            top: mouse.y + 16,
          }}
        >
          click
        </div>
      )}

      {mode === "intro" && (
        <div
          className="scroll-tip"
          style={{
            left: mouse.x + 16,
            top: mouse.y + 16,
          }}
        >
          scroll
        </div>
      )}

      {mode === "title" && (
        <div className="caption">
          <span>{captionLine1}</span>
          <span>{captionLine2}</span>
        </div>
      )}

      {mode === "intro" && (
        <section className="intro-scroll-lock">
          <p
            className="intro-scroll-text"
            style={{
              opacity: 0.3 + introProgress * 0.7,
              color: `rgb(${textValue}, ${textValue}, ${textValue})`,
              transform: `translate(-50%, ${72 - introProgress * 108}vh)`,
            }}
          >
            {INTRO_TEXT}
          </p>
        </section>
      )}
    </main>
  );
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

  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.fillStyle = "rgba(244,240,232,0.96)";
  ctx.textBaseline = "top";

  lines.forEach((line, y) => {
    const shift =
      isGlitch && Math.random() > 0.7 ? rand(-80, 80) * transitionT : 0;

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

function rand(min, max) {
  return Math.random() * (max - min) + min;
}