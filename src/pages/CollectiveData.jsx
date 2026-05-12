import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import * as d3 from "d3";
import "./CollectiveData.css";

const COLORS = {
  Physical: "#2f80ff",
  Menstrual: "#a45cff",
  "Urological & Sexual": "#ff5bbd",
  Cognitive: "#9aa0a6",
  "Dermatological & Sensory": "#62d7ff",
  Vasomotor: "#ff4040",
  Gastrointestinal: "#ffb08a",
  "Sleep & Fatigue": "#7fd36b",
};

const womenData = [
  {
    name: "Woman 1",
    years: 2,
    age: 36,
    ethnicity: "South Asian",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Fatigue, brain fog, irregular periods",
  },
  {
    name: "Woman 2",
    years: 15,
    age: 56,
    ethnicity: "White",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Dryness, insomnia, joint pain",
  },
  {
    name: "Woman 3",
    years: 5,
    age: 43,
    ethnicity: "Black",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Cramps, anxiety, fatigue",
  },
  {
    name: "Woman 4",
    years: 8,
    age: 48,
    ethnicity: "Latina",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Sleep disruption, mood swings, headaches",
  },
  {
    name: "Woman 5",
    years: 1.5,
    age: 39,
    ethnicity: "East Asian",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Memory issues, fatigue, anxiety",
  },
  {
    name: "Woman 6",
    years: 12,
    age: 52,
    ethnicity: "Mixed ethnicity",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Night sweats, hot flashes, body aches",
  },
  {
    name: "Woman 7",
    years: 10,
    age: 50,
    ethnicity: "South Asian",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Fatigue, irregular periods, bloating",
  },
  {
    name: "Woman 8",
    years: 6,
    age: 45,
    ethnicity: "Middle Eastern",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Mood swings, brain fog, sleep disruption",
  },
  {
    name: "Woman 9",
    years: 9,
    age: 47,
    ethnicity: "Native American",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Low libido, urinary urgency, fatigue",
  },
  {
    name: "Woman 10",
    years: 10,
    age: 51,
    ethnicity: "Black",
    initialSymptom: "Irregular periods",
    challengingSymptom: "Hot flashes",
    mostPersistentSymptom: "low libido",
    overlookedSymptoms: "Fatigue, brain fog",
    otherSymptoms: "Night sweats, fatigue, anxiety",
  },
];

const symptomPool = [
  ["Hot flashes", "Vasomotor"],
  ["Night sweats", "Vasomotor"],
  ["Fatigue", "Sleep & Fatigue"],
  ["Insomnia", "Sleep & Fatigue"],
  ["Restless sleep", "Sleep & Fatigue"],
  ["Heavy bleeding", "Menstrual"],
  ["Irregular periods", "Menstrual"],
  ["Spotting", "Menstrual"],
  ["Cramps", "Menstrual"],
  ["Low libido", "Urological & Sexual"],
  ["Vaginal dryness", "Urological & Sexual"],
  ["Urinary urgency", "Urological & Sexual"],
  ["UTI", "Urological & Sexual"],
  ["Brain fog", "Cognitive"],
  ["Memory issues", "Cognitive"],
  ["Focus issues", "Cognitive"],
  ["Joint pain", "Physical"],
  ["Body aches", "Physical"],
  ["Headache", "Physical"],
  ["Bloating", "Gastrointestinal"],
  ["Digestive issues", "Gastrointestinal"],
  ["Itchy skin", "Dermatological & Sensory"],
  ["Tinnitus", "Dermatological & Sensory"],
  ["Dizziness", "Dermatological & Sensory"],
];

function RingGuide() {
  return (
    <>
      <section className="ringGuide">
        <h2>how to read the rings*</h2>

        <div className="ringGuide__content">
          <div className="ringGuide__rings" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <i></i>
            <span></span>
          </div>

          <div className="ringGuide__text">
            <p>Each outer arc represents one year in perimenopause.</p>
            <p>2 yrs = 2 rings</p>
            <p>10 yrs = 10 rings</p>
            <p>15 yrs = 15 rings</p>
            <p>*hover over each pie for individual details</p>
          </div>
        </div>
      </section>

      <section className="symptomLegend">
        {Object.entries(COLORS).map(([category, color]) => (
          <div className="symptomLegend__item" key={category}>
            <span style={{ backgroundColor: color }}></span>
            <p>{category}</p>
          </div>
        ))}
      </section>
    </>
  );
}

function CollectiveSymptomGraph() {
  const svgRef = useRef(null);
  const [activeWoman, setActiveWoman] = useState(null);

  useEffect(() => {
    const width = 620;
    const height = 620;
    const cx = width / 2;
    const cy = height / 2;

    const innerRadius = 88;
    const outerRadius = 228;
    const ringStart = 246;
    const ringGap = 5.4;

    const segmentAngle = (Math.PI * 2) / womenData.length;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("class", "d3SymptomGraph");

    const root = svg.append("g").attr("transform", `translate(${cx}, ${cy})`);

    const arc = d3.arc();

    const angleToPoint = (angle, radius) => {
      return [
        Math.cos(angle - Math.PI / 2) * radius,
        Math.sin(angle - Math.PI / 2) * radius,
      ];
    };

    const yearArc = d3
      .arc()
      .innerRadius((d) => d.radius)
      .outerRadius((d) => d.radius)
      .startAngle((d) => d.start)
      .endAngle((d) => d.end);

    root.append("circle").attr("r", innerRadius).attr("class", "d3CenterCircle");

    root.append("text").attr("y", -22).attr("class", "d3CenterNumber").text("10");
    root.append("text").attr("y", 14).attr("class", "d3CenterTitle").text("WOMEN");
    root.append("text").attr("y", 42).attr("class", "d3CenterSub").text("Perimenopause");
    root.append("text").attr("y", 64).attr("class", "d3CenterSub").text("Symptom Map");

    const groups = root
      .selectAll(".womanGroup")
      .data(womenData)
      .enter()
      .append("g")
      .attr("class", "womanGroup")
      .on("mouseenter", function (event, d) {
        setActiveWoman(d);
        d3.select(this).select(".d3Wedge").classed("active", true);
      })
      .on("mouseleave", function () {
        setActiveWoman(null);
        d3.select(this).select(".d3Wedge").classed("active", false);
      });

    groups.each(function (woman, index) {
      const group = d3.select(this);

      const start = index * segmentAngle + 0.035;
      const end = (index + 1) * segmentAngle - 0.035;
      const mid = (start + end) / 2;

      group
        .append("path")
        .attr("class", "d3Wedge")
        .attr(
          "d",
          arc({
            innerRadius,
            outerRadius,
            startAngle: start,
            endAngle: end,
          })
        );

      group
        .append("line")
        .attr("class", "d3Divider")
        .attr("x1", angleToPoint(start, innerRadius)[0])
        .attr("y1", angleToPoint(start, innerRadius)[1])
        .attr("x2", angleToPoint(start, outerRadius)[0])
        .attr("y2", angleToPoint(start, outerRadius)[1]);

      

      const ringCount = Math.round(woman.years);

      const rings = Array.from({ length: ringCount }, (_, ringIndex) => ({
        radius: ringStart + ringIndex * ringGap,
        start: start + 0.045,
        end: end - 0.045,
      }));

      group
        .selectAll(".d3YearRing")
        .data(rings)
        .enter()
        .append("path")
        .attr("class", "d3YearRing")
        .attr("d", yearArc);

      const dot = angleToPoint(mid, ringStart - 5);

      group
        .append("circle")
        .attr("class", "d3YearDot")
        .attr("cx", dot[0])
        .attr("cy", dot[1])
        .attr("r", 4.2);

      const yearText = angleToPoint(mid, ringStart + ringCount * ringGap + 22);

      group
        .append("text")
        .attr("class", "d3YearLabel")
        .attr("x", yearText[0])
        .attr("y", yearText[1])
        .text(`${woman.years} yrs`);

      const symptomCount = 10 + ((index * 3) % 9);

      const symptoms = Array.from({ length: symptomCount }, (_, symptomIndex) => {
        const symptom = symptomPool[(index * 4 + symptomIndex * 3) % symptomPool.length];

        const angleJitter =
          Math.sin(symptomIndex * 12.9898 + index * 78.233) * 43758.5453;

        const radiusJitter =
          Math.cos(symptomIndex * 4.721 + index * 31.17) * 24634.6345;

        const randomA =
          start +
          0.18 +
          ((angleJitter - Math.floor(angleJitter)) * (end - start - 0.36));

        const randomR =
          innerRadius +
          26 +
          ((radiusJitter - Math.floor(radiusJitter)) * 105);

        const [x, y] = angleToPoint(randomA, randomR);

        return {
          x,
          y,
          name: symptom[0],
          category: symptom[1],
          color: COLORS[symptom[1]],
          size: 2.1 + (symptomIndex % 4) * 0.45,
        };
      });

      group
        .selectAll(".d3SymptomDot")
        .data(symptoms)
        .enter()
        .append("circle")
        .attr("class", "d3SymptomDot")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.size)
        .attr("fill", (d) => d.color)
        .append("title")
        .text((d) => d.name);
    });
  }, []);

  return (
    <section className="collectiveGraphBlock">
      <svg ref={svgRef} />

      {activeWoman && (
        <div className="hoverInfoPanel">
          <div className="hoverInfoPanel__line" />

          <h2>{activeWoman.name}</h2>

          <div className="hoverInfoPanel__grid">
            <div>
              <span>Age</span>
              <strong>{activeWoman.age}</strong>
            </div>

            <div>
              <span>Ethnicity</span>
              <strong>{activeWoman.ethnicity}</strong>
            </div>

            <div>
              <span>Years in Perimenopause</span>
              <strong>{activeWoman.years} yrs</strong>
            </div>

            <div>
              <span>Initial Symptom</span>
              <strong>{activeWoman.initialSymptom}</strong>
            </div>

            <div>
              <span>Challenging Symptom</span>
              <strong>{activeWoman.challengingSymptom}</strong>
            </div>

            <div>
              <span>Most persistent Symptom</span>
              <strong>{activeWoman.mostPersistentSymptom}</strong>
            </div>

            <div>
              <span>Other Symptoms</span>
              <strong>{activeWoman.otherSymptoms}</strong>
            </div>

            <div>
              <span>Symptoms Overlooked by Doctors</span>
              <strong>{activeWoman.overlookedSymptoms}</strong>
            </div>

            
          </div>
        </div>
      )}
    </section>
  );
}

function TreatmentEffectivenessGrid() {
  const [filter, setFilter] = useState("all");

  const treatments = [
  { name: "HRT", type: "medical" },
  { name: "LEVOTHYROXINE", type: "medical" },
  { name: "ANTI-DEPRESSANT", type: "medical" },
  { name: "GLP-1", type: "medical" },
  { name: "NSAID", type: "medical" },
  { name: "STEROID JOINT INJECTION", type: "medical" },
  { name: "IUD", type: "medical" },
  { name: "CORTISOL SHOT", type: "medical" },
  { name: "ACCUTANE", type: "medical" },

  { name: "ACUPUNCTURE", type: "nonmedical" },
  { name: "MAGNESIUM", type: "nonmedical" },
  { name: "CBT", type: "nonmedical" },
  { name: "YOGA", type: "nonmedical" },
  { name: "WALKING", type: "nonmedical" },
  { name: "SLEEP HYGIENE", type: "nonmedical" },
  { name: "MEDITATION", type: "nonmedical" },
  { name: "DIET CHANGE", type: "nonmedical" },
];

  const symptoms = [
  "Hot Flash",
  "Insomnia",
  "Brain Fog",
  "Weight Gain",
  "Anxiety",
  "Frozen Shoulder",
  "Cramps",
  "Body Aches",
  "Breast Tenderness",
  "Panic",
];

  const visibleTreatments =
    filter === "all"
      ? treatments
      : treatments.filter((t) => t.type === filter);

  return (
    <section className="treatmentGridSection">
      <div className="treatmentGridHeader">
        <div>
          <p>TREATMENT MAP</p>
          <h2>Medical & non-medical treatments: effectiveness and side effects.</h2>
        </div>

        <div className="treatmentFilters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All Treatments
          </button>

          <button
            className={filter === "medical" ? "active" : ""}
            onClick={() => setFilter("medical")}
          >
            Medical Treatments
          </button>

          <button
            className={filter === "nonmedical" ? "active" : ""}
            onClick={() => setFilter("nonmedical")}
          >
            Non-Medical Treatments
          </button>
        </div>
      </div>

      <div className="treatmentGridWrap">
        <div className="treatmentGrid">

          {symptoms.map((symptom, i) => (
            <div className="treatmentGrid__xLabel" key={`symptom-${i}`}>
              {symptom}
            </div>
          ))}

          {visibleTreatments.map((treatment) => (
            <React.Fragment key={treatment.name}>
              <div className="treatmentGrid__yLabel">{treatment.name}</div>

              {symptoms.map((_, i) => (
                <div className="treatmentCell" key={`${treatment.name}-${i}`}>
                  {/* leave empty, fill later */}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <aside className="treatmentGuide">
          <h3>Effectiveness Guide</h3>

          <div className="guideItem">
            <span className="effectBox effectBox--less" />
            <p>Less effective<br />{"< 50% filled"}</p>
          </div>

          <div className="guideItem">
            <span className="effectBox effectBox--medium" />
            <p>Moderate effective<br />~ 50% filled</p>
          </div>

          <div className="guideItem">
            <span className="effectBox effectBox--full" />
            <p>Very effective<br />fully filled</p>
          </div>

          <div className="guideItem guideItem--sideEffect">
            <span className="sideEffectDot" />
            <p>Led to another symptom / side effect</p>
          </div>
        </aside>
      </div>
    </section>
  );
}


export default function CollectiveData() {
  return (
    <main className="collectiveData">
      <nav className="nav">
        <Link to="/" className="nav__brand">
          INVISIBLE DATA
        </Link>

        <div className="nav__links">
          <Link to="/about">ABOUT</Link>
          <Link to="/path">PATH</Link>
          <Link to="/dearperi">DEAR PERI</Link>
        </div>
      </nav>

      <section className="collectiveData__subnav">
        <NavLink to="/collective-data">Collective Data</NavLink>
        <NavLink to="/insitu">Sense Making</NavLink>
        <NavLink to="/personal-data">Engage with your own data</NavLink>
      </section>

      <section className="collectiveData__intro">
        <p>COLLECTIVE DATA</p>
        <h1>Perimenopause symptom map across individual journeys.</h1>
      </section>

      <RingGuide />

      <CollectiveSymptomGraph />
      <TreatmentEffectivenessGrid />

      <section className="collectiveData__placeholder">
        <p>More collective data visualizations will continue here.</p>
      </section>
    </main>
  );
}