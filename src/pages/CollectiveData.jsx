import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import * as d3 from "d3";
import "./CollectiveData.css";

const COLORS = {
  Physical: "#2f80ff",
  Menstrual: "#a45cff",
  "Urological & Sexual": "#ff5bbd",
  Cognitive: "#947415",
  "Dermatological & Sensory": "#62d7ff",
  Vasomotor: "#ff4040",
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
  ["Bloating", "Physical"],
  ["Digestive issues", "Physical"],
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
  const [activeWoman, setActiveWoman] = useState(womenData[0]);

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
        setActiveWoman(womenData[0]);
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
  { name: "ZOLOFT", type: "medical" },
  { name: "GLP-1", type: "medical" },
  { name: "NSAID", type: "medical" },
  { name: "STEROID JOINT INJECTION", type: "medical" },
  { name: "IUD", type: "medical" },
  { name: "CORTISOL SHOT", type: "medical" },
  { name: "ACCUTANE", type: "medical" },
  { name: "GABAPENTIN", type: "medical" },
  { name: "IBUPROFEN", type: "medical" },

  { name: "ACCUPUNCTURE", type: "nonmedical" },
  { name: "MAGNESIUM", type: "nonmedical" },
  { name: "ALPHA BRAIN SUPPLEMENT", type: "nonmedical" },
  { name: "CBT", type: "nonmedical" },
  { name: "EXERCISE", type: "nonmedical" },
  { name: "SLEEP HYGIENE", type: "nonmedical" },
  { name: "MEDITATION", type: "nonmedical" },
  { name: "DIET CHANGE", type: "nonmedical" },
];

  const symptomGroups = {
  common: [
    "Hot Flashes",
    "Insomnia",
    "Brain Fog",
    "Weight Gain",
    "Anxiety",
    "Mood Swings",
    "Depression",
  ],
  pain: [
    "Frozen Shoulder",
    "Cramps",
    "Body Aches",
    "Back Pain",
    "Breast Tenderness",
  ],
  other: [
    "Panic",
    "IBS",
    "Skin",
    "Fatigue",
    "Stomach Aches",
    "Thyroid",
  ],
};

const [symptomFilter, setSymptomFilter] = useState("common");

const symptoms = symptomGroups[symptomFilter];

  const visibleTreatments =
    filter === "all"
      ? treatments
      : treatments.filter((t) => t.type === filter);

 const cellData = {
  "GLP-1-Weight Gain": { level: "high", sideEffect: "Fatigue" },

  "CBT-Anxiety": { level: "medium" },
  "CBT-Hot Flashes": { level: "medium" },

  "STEROID JOINT INJECTION-Frozen Shoulder": { level: "high" },

  "ALPHA BRAIN SUPPLEMENT-Brain Fog": { level: "medium" },

  "MAGNESIUM-Anxiety": { level: "low" },
  "MAGNESIUM-Insomnia": { level: "medium" },

  "ZOLOFT-Anxiety": { level: "medium" },

  "HRT-Brain Fog": { level: "low" },
  "HRT-Mood Swings": { level: "high" },
  "HRT-Hot Flashes": { level: "high" },
  "HRT-Frozen Shoulder": { level: "low" },
  "HRT-Breast Tenderness": { level: "low" },
  "HRT-Body Aches": { level: "medium" },
  "HRT-Thyroid": { level: "low" },

  "IBUPROFEN-Body Aches": { level: "high" },

  "GABAPENTIN-Back Pain": { level: "low" },

  "ACUPUNCTURE-IBS": { level: "high" },

  "ANTI-DEPRESSANT-Anxiety": { sideEffect: "Anxiety" },

  "NSAID-Skin": { level: "low", sideEffect: "Stomach Aches" },
  "NSAID-Back Pain": { level: "low", sideEffect: "Stomach Aches" },

  "ACCUTANE-Skin": { level: "low" },

  "IUD-Cramps": { level: "high" },

  "LEVOTHYROXINE-Fatigue": { level: "low" },
  "LEVOTHYROXINE-Thyroid": { level: "medium" },

  "CORTISOL SHOT-Frozen Shoulder": { level: "high" },

  "SLEEP HYGIENE-Hot Flashes": { level: "medium" },
  "SLEEP HYGIENE-Insomnia": { level: "low" },

  "EXERCISE-Weight Gain": { level: "medium" },
  "EXERCISE-Frozen Shoulder": { level: "low" },

  "EXERCISE-Anxiety": { level: "high" },
  "EXERCISE-Insomnia": { level: "low" },
  "MEDITATION-Anxiety": { level: "high" },
  "MEDITATION-Brain Fog": { level: "medium" },
  "MEDITATION-Panic": { level: "medium" },
  "MEDITATION-Insomnia": { level: "low" },
  "MEDITATION-Mood Swings": { level: "low" },
  "MEDITATION-Depression": { level: "medium" },

  "DIET CHANGE-Weight Gain": { level: "medium" },
  "DIET CHANGE-Hot Flashes": { level: "high" },
  "DIET CHANGE-IBS": { level: "high" },
  "DIET CHANGE-Stomach Aches": { level: "medium" },

  "ACCUPUNCTURE-Frozen Shoulder": { level: "medium" },
  "ACCUPUNCTURE-Back Pain": { level: "medium" },
  "ACCUPUNCTURE-Body Aches": { level: "medium" },
  "ACCUPUNCTURE-Cramps": { level: "low" },
  "ACCUPUNCTURE-Anxiety": { level: "low" },
  "ACCUPUNCTURE-IBS": { level: "low" },

  "MAGNESIUM-Fatigue": { level: "low" },
  "CBT-Anxiety": { level: "low" },
  "CBT-Depression": { level: "low" },
  "CBT-Brain Fog": { level: "low" },
  "CBT-Insomnia": { level: "low" },

};

const getCell = (treatment, symptom) => {
  return cellData[`${treatment}-${symptom}`];
};

  return (
    <section className="treatmentGridSection">
      <div className="treatmentGridHeader">
        <div>
          <p>TREATMENT MAP</p>
          <h2>Medical & non-medical treatments: effectiveness and side effects.</h2>
        </div>

        <div className="treatmentFilters">
          <p className="filterLabel">FILTER TREATMENT</p>

          <button
            className={filter === "medical" ? "active" : ""}
            onClick={() => setFilter("medical")}
          >
            Medical
          </button>

          <button
            className={filter === "nonmedical" ? "active" : ""}
            onClick={() => setFilter("nonmedical")}
          >
            Non-Medical
          </button>
        </div>

        <div className="symptomFilters">
        <p>Filter symptoms</p>

        <button
          className={symptomFilter === "common" ? "active" : ""}
          onClick={() => setSymptomFilter("common")}
        >
          Common
        </button>

        <button
          className={symptomFilter === "pain" ? "active" : ""}
          onClick={() => setSymptomFilter("pain")}
        >
          Pain / Body
        </button>

        <button
          className={symptomFilter === "other" ? "active" : ""}
          onClick={() => setSymptomFilter("other")}
        >
          Other
        </button>
      </div>
      </div>

      <div className="treatmentGridWrap">
        <div className="treatmentGridArea">
        <div className="treatmentYAxis">
          {visibleTreatments.map((treatment) => (
            <div className="treatmentGrid__yLabel" key={treatment.name}>
              {treatment.name}
            </div>
          ))}
        </div>

          <div
            className="treatmentMatrix"
            style={{
              gridTemplateColumns: `repeat(${symptoms.length}, 40px)`,
            }}
          >
            {visibleTreatments.map((treatment) =>
              symptoms.map((symptom) => {
                const cell = getCell(treatment.name, symptom);

                return (
                  <div
                    key={`${treatment.name}-${symptom}`}
                    className={`treatmentCell ${
                      cell?.level === "high"
                        ? "treatmentCell--high"
                        : cell?.level === "medium"
                        ? "treatmentCell--medium"
                        : cell?.level === "low"
                        ? "treatmentCell--low"
                        : ""
                    }`}
                  >
                    {cell?.sideEffect && (
                      <div className="treatmentDotWrap">
                        <span className="treatmentSideEffectDot" />

                        <div className="treatmentTooltip">
                          {cell.sideEffect}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div
            className="treatmentXAxis"
            style={{
              gridTemplateColumns: `repeat(${symptoms.length}, 40px)`,
            }}
          >
            {symptoms.map((symptom, i) => (
              <div className="treatmentGrid__xLabel" key={`symptom-${i}`}>
                {symptom}
              </div>
            ))}
          </div>
        </div>

        <aside className="treatmentGuide">
          <h3>Effectiveness Guide</h3>

          <div className="guideItem">
            <span className="effectBox effectBox--less" />
            <p>Less effective<br />{"< 50% filled"}</p>
          </div>

          <div className="guideItem">
            <span className="effectBox effectBox--medium" />
            <p>Moderate effective<br />~ 50%-70% filled</p>
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
/*food trigger graph*/

function TriggerFoodEcologyGraph() {
  const triggerItems = [
    { name: "Alcohol", note: true, symptoms: ["Hot flashes", "Depression", "Migraine", "Night sweats", "Brain fog", "Insomnia"] },
    { name: "Caffeine", note: true, symptoms: ["Hot flashes", "Insomnia", "Anxiety", "Depression"] },
    { name: "Cheese", note: false, symptoms: ["Food intolerance"] },
    { name: "Salami / Nitrates", note: true, symptoms: ["Food intolerance"] },
    { name: "Sugar", note: false, symptoms: ["Insulin resistance", "Weight gain", "Vaginal dryness"] },
    { name: "Fried food", note: false, symptoms: ["IBS", "Bloating", "Heart palpitations"] },
    { name: "White bread / Flour", note: false, symptoms: ["Weight gain", "Indigestion", "Vaginal dryness", "Insomnia"] },
    { name: "Dairy", note: false, symptoms: ["Indigestion", "Skin issues", "IBS", "Bloating", "Weight gain"] },
  ];

  const supportiveItems = [
    { name: "Eggs", symptoms: ["Muscle retention"] },
    { name: "Spinach", symptoms: ["Digestion", "Bone health"] },
    { name: "Fennel seeds", symptoms: ["Period regulation"] },
    { name: "Herbs", symptoms: ["Hair growth"] },
    { name: "Meat", symptoms: ["Helps maintain weight", "Bone health"] },
    { name: "Whole grains", symptoms: ["Helps with IBS"] },
    { name: "Protein", symptoms: ["Weight management"] },
  ];

  const outcomes = [
    "Hot flashes",
    "Night sweats",
    "Brain fog",
    "Insomnia",
    "Anxiety",
    "Depression",
    "Migraine",
    "Food intolerance",
    "Insulin resistance",
    "Weight gain",
    "IBS",
    "Bloating",
    "Heart palpitations",
    "Indigestion",
    "Vaginal dryness",
    "Skin issues",
    "Muscle retention",
    "Digestion",
    "Bone health",
    "Period regulation",
    "Hair growth",
    "Helps maintain weight",
    "Weight management",
    "Helps with IBS",
  ];

  const getY = (name) => {
    const index = outcomes.indexOf(name);
    return 70 + index * 24;
  };

  const leftY = (index) => 70 + index * 42;
  const supportY = (index) => 470 + index * 42;

  const curve = (x1, y1, x2, y2) =>
    `M ${x1} ${y1} C 480 ${y1}, 500 ${y2}, ${x2} ${y2}`;

  return (
    <section className="triggerEcology">
      <div className="triggerEcology__header">
        <p>TRIGGERS & FOOD BEHAVIOR</p>
        <h2>Food Pattern</h2>
        <span>
          A unified network of avoided foods, supportive foods, and symptom
          outcomes in perimenopause.
        </span>
      </div>

      <div className="triggerEcology__chart">
        <div className="triggerEcology__legend">
          <h3>Legend</h3>

          <div><span className="legendLine legendLine--strong" />Strong trigger</div>
          <div><span className="legendLine legendLine--support" />Supports / beneficial</div>
          <div><span className="legendDot legendDot--left" />Used to enjoy, but left due to symptoms</div>
        </div>

        <svg viewBox="0 0 1100 720" className="triggerEcology__svg">
          <text x="130" y="36" className="triggerLabel triggerLabel--red">
            TRIGGERS & FOODS TO AVOID
          </text>

          <text x="130" y="438" className="triggerLabel triggerLabel--green">
            SUPPORTING FOODS
          </text>

          <text x="840" y="36" className="triggerLabel triggerLabel--red">
            SYMPTOMS
          </text>
          {triggerItems.map((item, i) =>
            item.symptoms.map((symptom) => (
              <path
                key={`${item.name}-${symptom}`}
                d={curve(150, leftY(i), 580, getY(symptom))} /* connector length */
                className="triggerPath triggerPath--avoid"
              />
            ))
          )}

          {supportiveItems.map((item, i) =>
            item.symptoms.map((symptom) => (
              <path
                key={`${item.name}-${symptom}`}
                d={curve(150, supportY(i), 580, getY(symptom))} /* connector length */
                className="triggerPath triggerPath--support"
              />
            ))
          )}

          {triggerItems.map((item, i) => (
  <g key={item.name}>
    <text
      x="130" /*food text on x axis */
      y={leftY(i) + 5}
      textAnchor="end"
      className="triggerItemText"
    >
      {item.name}
    </text>

    <circle
      cx="150"
      cy={leftY(i)}
      r="6"
      className={item.note ? "triggerLeftDot" : "triggerAvoidDot"}
    />
  </g>
))}

    {supportiveItems.map((item, i) => (
      <g key={item.name}>
        <text
          x="130"
          y={supportY(i) + 5}
          textAnchor = "end"
          className="triggerItemText"
        >
          {item.name}
        </text>

        <circle
          cx="150"
          cy={supportY(i)}
          r="6"
          className="triggerSupportDot"
        />
      </g>
    ))}

          {outcomes.map((symptom) => {
            const isSupport = [
              "Muscle retention",
              "Digestion",
              "Bone health",
              "Period regulation",
              "Hair growth",
              "Helps maintain weight",
              "Weight management",
              "Helps with IBS",
            ].includes(symptom);

            return (
              <g key={symptom}>
                <circle
                  cx="580"
                  cy={getY(symptom)}
                  r="5"
                  className={isSupport ? "outcomeDot outcomeDot--support" : "outcomeDot"}
                />
                <text x="600" y={getY(symptom) + 5} className="outcomeText">
                  {symptom}
                </text>
              </g>
            );
          })}
        </svg>
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
          <Link to="/dear-peri">DEAR PERI</Link>
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
      <TriggerFoodEcologyGraph />

</main>
);
}