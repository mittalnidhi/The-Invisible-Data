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
  const textThreeRef = useRef(null);

  const boxOneRef = useRef(null);
  const asciiNumberOneRef = useRef(null);

  const boxTwoRef = useRef(null);
  const asciiNumberTwoRef = useRef(null);

  const dotOneRef = useRef(null);
  const dotTwoRef = useRef(null);

  useLayoutEffect(() => {
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    const host = stageRef.current;
    if (!host) return;

    const ctx = gsap.context(() => {
      const render = (p) => {
        /**
         * FIRST BOX
         * 1% → 30%
         */
        const firstBoxEnd = 0.65;
        const firstP = clamp01(p / firstBoxEnd);

        const firstPercent = Math.round(lerp(1, 30, firstP));

        if (asciiNumberOneRef.current) {
          asciiNumberOneRef.current.textContent = toAsciiNumber(firstPercent);
        }

        gsap.set(boxOneRef.current, {
          width: lerp(90, Math.min(window.innerWidth * 0.30, 460), firstP),
          height: lerp(70, Math.min(window.innerHeight * 0.36, 300), firstP),
        });

        /**
         * TEXT CHANGE AT 25%
         */
        const textSwitchPoint = ((25 - 1) / (30 - 1)) * firstBoxEnd;

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

        /**
         * SECOND BOX
         * Starts only after first box reaches 30%
         * 30% → 45%
         */
        const secondStart = firstBoxEnd;
        const secondP = clamp01((p - secondStart) / 0.35);

        const secondPercent = Math.round(lerp(1, 45, secondP));

        if (asciiNumberTwoRef.current) {
          asciiNumberTwoRef.current.textContent = toAsciiNumber(secondPercent);
        }

        /**
         * DOT ACTIVATION
         * Second dot activates when second box reaches 15%
         */
        const secondLiveValue = lerp(1, 45, secondP);

        if (secondLiveValue >= 15) {
          dotOneRef.current.classList.remove("about__dot--active");
          dotTwoRef.current.classList.add("about__dot--active");
        } else {
          dotOneRef.current.classList.add("about__dot--active");
          dotTwoRef.current.classList.remove("about__dot--active");
        }

        gsap.set(boxTwoRef.current, {
          width: lerp(110, Math.min(window.innerWidth * 0.40, 580), secondP),
          height: lerp(85, Math.min(window.innerHeight * 0.50, 420), secondP),
          x: 0,
          y: 0,
          right: 0,
          bottom: 0,
          opacity: secondP,
        });

        /**
         * THIRD TEXT
         * Shows only when second box starts
         */
        const thirdTextSwitchPoint =
          secondStart + ((38 - 30) / (45 - 30)) * 0.35;
        const textTwoOut = clamp01((p - thirdTextSwitchPoint) / 0.05);
        const textThreeIn = clamp01((p - thirdTextSwitchPoint) / 0.08);

        gsap.set(textTwoRef.current, {
          opacity: textTwoIn * (1 - textTwoOut),
          y: -22 * textTwoOut,
        });

        gsap.set(textThreeRef.current, {
          opacity: textThreeIn,
          y: 30 - 30 * textThreeIn,
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
          <button
            className="aboutNav__button"
            onClick={() => navigate("/dear-peri")}
          >
            DEAR PERI
          </button>
        </div>
      </nav>

      <section ref={stageRef} className="about__stage">
        <div className="about__leftDots" aria-hidden="true">
          <span ref={dotOneRef} className="about__dot about__dot--active" />
          <span ref={dotTwoRef} className="about__dot" />
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
            At any given time,
            <br />
            around 50 million women
            <br />
            in the U.S are in Perimenopause.
          </h1>

          <h1 ref={textThreeRef} className="about__headline about__headline--two">
            Around 45% women
            <br />
            in the world
            <br />
            are in midlife.
          </h1>
        </div>

        <div ref={boxTwoRef} className="about__dataBox about__dataBox--two">
          <pre ref={asciiNumberTwoRef} className="about__asciiNumber">
            {toAsciiNumber(30)}
          </pre>
        </div>

        <div ref={boxOneRef} className="about__dataBox">
          <pre ref={asciiNumberOneRef} className="about__asciiNumber">
            {toAsciiNumber(1)}
          </pre>
        </div>
      </section>
    </main>
  );
}