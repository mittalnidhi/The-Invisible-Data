import React, { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;

function toAsciiNumber(num) {
  const patterns = {
    "0": [
      "   +++++++++   ",
      " +++++++++++++ ",
      "+++++     +++++",
      "+++++     +++++",
      "+++++     +++++",
      "+++++     +++++",
      "+++++     +++++",
      " +++++++++++++ ",
      "   +++++++++   ",
    ],
    "1": [
      "     +++++     ",
      "   +++++++     ",
      "     +++++     ",
      "     +++++     ",
      "     +++++     ",
      "     +++++     ",
      "     +++++     ",
      "     +++++     ",
      "   +++++++++   ",
    ],
    "2": [
      "  ++++++++++   ",
      "++++++++++++++ ",
      "++++      +++++",
      "          +++++",
      "       ++++++  ",
      "    ++++++     ",
      " ++++++        ",
      "+++++          ",
      "+++++++++++++++",
    ],
    "3": [
      "  ++++++++++   ",
      "++++++++++++++ ",
      "++++      +++++",
      "          +++++",
      "     ++++++++  ",
      "          +++++",
      "++++      +++++",
      "++++++++++++++ ",
      "  ++++++++++   ",
    ],
    "4": [
      "++++     +++++ ",
      "++++     +++++ ",
      "++++     +++++ ",
      "++++     +++++ ",
      "+++++++++++++++",
      "         +++++ ",
      "         +++++ ",
      "         +++++ ",
      "         +++++ ",
    ],
    "5": [
      "+++++++++++++++",
      "+++++          ",
      "+++++          ",
      "++++++++++++   ",
      "++++++++++++++ ",
      "          +++++",
      "++++      +++++",
      "++++++++++++++ ",
      "  ++++++++++   ",
    ],
    "6": [
      "   +++++++++   ",
      " +++++++++++++ ",
      "+++++          ",
      "+++++          ",
      "++++++++++++   ",
      "++++++++++++++ ",
      "+++++     +++++",
      "++++++++++++++ ",
      "  ++++++++++   ",
    ],
    "7": [
      "+++++++++++++++",
      "          +++++",
      "         +++++ ",
      "        +++++  ",
      "       +++++   ",
      "      +++++    ",
      "     +++++     ",
      "    +++++      ",
      "   +++++       ",
    ],
    "8": [
      "  ++++++++++   ",
      "++++++++++++++ ",
      "+++++    +++++ ",
      "+++++    +++++ ",
      " ++++++++++++  ",
      "+++++    +++++ ",
      "+++++    +++++ ",
      "++++++++++++++ ",
      "  ++++++++++   ",
    ],
    "9": [
      "  ++++++++++   ",
      "++++++++++++++ ",
      "+++++     +++++",
      "+++++     +++++",
      "+++++++++++++++",
      "          +++++",
      "          +++++",
      "++++++++++++++ ",
      "  +++++++++    ",
    ],
    "%": [
      "++++       +   ",
      "++++      +    ",
      "        ++     ",
      "       ++      ",
      "      ++       ",
      "     ++        ",
      "    ++   +++++ ",
      "   +    +++++  ",
      "  +     +++++  ",
    ],
  };

  const chars = `${num}%`.split("");
  const rows = Array.from({ length: 9 }, () => "");

  chars.forEach((char) => {
    const block = patterns[char];
    if (!block) return;

    block.forEach((line, i) => {
      rows[i] += line + "   ";
    });
  });

  return rows.join("\n");
}

export default function About() {
  const navigate = useNavigate();

  const stageRef = useRef(null);
  const textOneRef = useRef(null);
  const textTwoRef = useRef(null);
  const boxRef = useRef(null);
  const asciiNumberRef = useRef(null);

  useLayoutEffect(() => {
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    const host = stageRef.current;
    if (!host) return;

    const ctx = gsap.context(() => {
      const render = (p) => {
        const percent = Math.round(lerp(15, 45, p));
        asciiNumberRef.current.textContent = toAsciiNumber(percent);

        const boxW = lerp(90, window.innerWidth * 0.38, p);
        const boxH = lerp(70, window.innerHeight * 0.36, p);

        gsap.set(boxRef.current, {
          width: boxW,
          height: boxH,
        });

       const textSwitchPoint = (43 - 15) / (45 - 15);

const textOneOut = clamp01((p - textSwitchPoint) / 0.04);
const textTwoIn = clamp01((p - textSwitchPoint) / 0.06);

gsap.set(textOneRef.current, {
  opacity: 1 - textOneOut,
  y: -24 * textOneOut,
});

gsap.set(textTwoRef.current, {
  opacity: textTwoIn,
  y: 30 - 30 * textTwoIn,
});
      };

      render(0);

      const trigger = ScrollTrigger.create({
        trigger: ".about",
        start: "top top",
        end: "+=2200",
        scrub: true,
        pin: host,
        anticipatePin: 1,
        onUpdate: (self) => render(self.progress),
      });

      setTimeout(() => ScrollTrigger.refresh(), 100);

      return () => trigger.kill();
    }, host);

    return () => ctx.revert();
  }, []);

  return (
    <main className="about">
      <nav className="aboutNav">
        <button className="aboutNav__button" onClick={() => navigate("/")}>
          THE INVISIBLE DATA
        </button>

        <div className="aboutNav__right">
          <button className="aboutNav__button" onClick={() => navigate("/about")}>
            ABOUT
          </button>
          <button className="aboutNav__button" onClick={() => navigate("/path")}>
            PATH
          </button>
          <button className="aboutNav__button" onClick={() => navigate("/dear-peri")}>
            DEAR PERI
          </button>
        </div>
      </nav>

      <section ref={stageRef} className="about__stage">
        <div className="about__leftDots" aria-hidden="true">
          <span className="about__dot about__dot--active" />
          <span className="about__dot" />
          <span className="about__dot" />
        </div>

        <div className="about__copy">
          <h1 ref={textOneRef} className="about__headline">
            Perimenopause is a
            <br />
            Public Health Crisis.
            <br />
            The Data is clear.
          </h1>

          <h1 ref={textTwoRef} className="about__headline about__headline--two">
            45% of Women in the
            <br />
            World are in Midlife.
          </h1>
        </div>

        <div ref={boxRef} className="about__dataBox">
          <pre ref={asciiNumberRef} className="about__asciiNumber">
            {toAsciiNumber(20)}
          </pre>
        </div>
      </section>
    </main>
  );
}