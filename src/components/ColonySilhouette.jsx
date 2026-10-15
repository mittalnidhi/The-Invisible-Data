
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import * as d3 from "d3";

import {
  useResizeObserver,
  useDebounceCallback,
} from "usehooks-ts";

import filterdata from "../data/filterData.json";
import colorMap from "../data/colorMap.json";

/* =========================================
   SILHOUETTE CONFIGURATION
========================================= */

const DESIGN_WIDTH = 700;

/* =========================================
   MAIN COMPONENT
========================================= */

export default function ColonySilhouette(props) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  /* =========================================
     RESPONSIVE RESIZE OBSERVER
  ========================================= */

  const onResize = useDebounceCallback(
    ({ width, height }) => {
      setSize({
        width: width || 0,
        height: height || 0,
      });
    },
    150
  );

  useResizeObserver({
    ref: containerRef,
    onResize,
  });

  /* =========================================
     PREPARE SYMPTOM DATA
  ========================================= */

  const data = useMemo(() => {
    const result = [];

    if (!Array.isArray(props.peridata)) {
      return result;
    }

    props.peridata.forEach((category) => {
      if (!Array.isArray(category.children)) {
        return;
      }

      category.children.forEach((symptom) => {
        const xs = Array.isArray(symptom.x)
          ? symptom.x
          : [];

        const ys = Array.isArray(symptom.y)
          ? symptom.y
          : [];

        const pointCount = Math.min(
          xs.length,
          ys.length
        );

        for (let i = 0; i < pointCount; i++) {
          result.push({
            id: `${category.name}-${symptom.name}-${i}`,
            name: symptom.name,
            category: category.name,
            value: symptom.value || 0,
            x: Number(xs[i]),
            y: Number(ys[i]),
            hovertext: symptom.hovertext || "",
          });
        }
      });
    });

    return result.filter(
      (d) =>
        Number.isFinite(d.x) &&
        Number.isFinite(d.y)
    );
  }, [props.peridata]);

  /* =========================================
     FILTER SYMPTOMS
  ========================================= */

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      if (
        props.currentCategory &&
        d.category !== props.currentCategory
      ) {
        return false;
      }

      if (
        props.currentView &&
        Array.isArray(filterdata[props.currentView]) &&
        !filterdata[props.currentView].includes(d.name)
      ) {
        return false;
      }

      if (
        props.currentStage &&
        Array.isArray(filterdata[props.currentStage]) &&
        !filterdata[props.currentStage].includes(d.name)
      ) {
        return false;
      }

      if (
        props.currentHormone &&
        Array.isArray(filterdata[props.currentHormone]) &&
        !filterdata[props.currentHormone].includes(d.name)
      ) {
        return false;
      }

      return true;
    });
  }, [
    data,
    props.currentCategory,
    props.currentView,
    props.currentStage,
    props.currentHormone,
  ]);

  /* =========================================
     DRAW D3 VISUALIZATION
  ========================================= */

  useEffect(() => {
    if (!svgRef.current) return;

    if (size.width <= 0 || size.height <= 0) {
      return;
    }

    drawSilhouettePoints({
      svgElement: svgRef.current,
      tooltipElement: tooltipRef.current,
      data: filteredData,
      width: size.width,
      height: size.height,
    });
  }, [
    filteredData,
    size.width,
    size.height,
  ]);

  /* =========================================
     DISMISS TOOLTIP ON OUTSIDE TAP

     Only touch interactions are affected.
     Desktop hover behavior is unchanged.
  ========================================= */

  useEffect(() => {
    const handleOutsideTap = (event) => {
      if (event.pointerType !== "touch") return;

      const svg = svgRef.current;
      const tooltip = tooltipRef.current;

      if (!svg || !tooltip) return;

      const target = event.target;

      // Do not dismiss when tapping a symptom dot.
      if (
        target instanceof Element &&
        target.closest("circle.symptom-point") &&
        svg.contains(target)
      ) {
        return;
      }

      hideSymptomTooltip(tooltip);
    };

    document.addEventListener(
      "pointerdown",
      handleOutsideTap
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideTap
      );
    };
  }, []);

  /* =========================================
     RENDER
  ========================================= */

  return (
    <>
      <div
        ref={containerRef}
        className="silhouette colony-silhouette-inner"
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
          aspectRatio: "1241 / 1754",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          flexShrink: 0,
        }}
      >
        {/* MAIN SVG */}

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${size.width || 700} ${
            size.height || 990
          }`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        />
      </div>

      {/* TOOLTIP RENDERED OUTSIDE SILHOUETTE */}

      {createPortal(
        <div
          ref={tooltipRef}
          id="colony-tooltip"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            opacity: 0,
            pointerEvents: "none",
            zIndex: 99999,

            width: "260px",
            maxWidth: "calc(100vw - 32px)",
            padding: "14px 16px",

            backgroundColor: "rgba(5, 20, 35, 0.96)",
            color: "white",
            borderRadius: "10px",

            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            lineHeight: 1.5,
            whiteSpace: "normal",
            overflowWrap: "break-word",
            boxSizing: "border-box",
          }}
        />,
        document.body
      )}
    </>
  );
}

/* =========================================
   DRAW SYMPTOM CIRCLES
========================================= */

function drawSilhouettePoints({
  svgElement,
  tooltipElement,
  data,
  width,
  height,
}) {
  const svg = d3.select(svgElement);

  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const scale = width / DESIGN_WIDTH;

  /* SORT POINTS BY FREQUENCY */

  const sortedData = [...data].sort(
    (a, b) => b.value - a.value
  );

  /* D3 DATA JOIN */

  const circles = svg
    .selectAll("circle.symptom-point")
    .data(sortedData, (d) => d.id);

  /* REMOVE */

  circles
    .exit()
    .interrupt()
    .transition()
    .duration(250)
    .attr("r", 0)
    .remove();

  /* ENTER */

  const entered = circles
    .enter()
    .append("circle")
    .attr("class", "symptom-point")
    .attr("cx", (d) => d.x * width)
    .attr("cy", (d) => d.y * height)
    .attr("r", 0)
    .attr(
      "fill",
      (d) => colorMap[d.category] || "#ffffff"
    )
    .style("cursor", "pointer");

  /* UPDATE */

  const merged = entered.merge(circles);

  merged
    .attr(
      "fill",
      (d) => colorMap[d.category] || "#ffffff"
    )
    .style("cursor", "pointer");

  /* =========================================
     DESKTOP HOVER + MOBILE TAP
  ========================================= */

  merged
    .on("pointerenter", function (event, d) {
      // Desktop / laptop hover only.
      if (event.pointerType === "touch") return;

      showSymptomTooltip(
        event,
        d,
        tooltipElement
      );

      d3.select(this)
        .interrupt()
        .attr("stroke", "white")
        .attr("stroke-width", 1.5);
    })

    .on("pointermove", function (event) {
      // Desktop / laptop only.
      if (event.pointerType === "touch") return;

      moveSymptomTooltip(
        event,
        tooltipElement
      );
    })

    .on("pointerleave", function (event) {
      // Do not dismiss mobile tooltips.
      if (event.pointerType !== "touch") {
        hideSymptomTooltip(tooltipElement);
      }

      d3.select(this)
        .attr("stroke-width", 0);
    })

    .on("click", function (event, d) {
      // Only touch activates persistent tooltip.
      if (event.pointerType !== "touch") return;

      event.stopPropagation();

      showSymptomTooltip(
        event,
        d,
        tooltipElement
      );
    });

  /* ANIMATE POSITION + RADIUS */

  merged
    .transition()
    .duration(350)
    .ease(d3.easeCubicOut)
    .attr("cx", (d) => d.x * width)
    .attr("cy", (d) => d.y * height)
    .attr("r", (d) => getRadius(d.value) * scale);

  /* FREQUENCY LEGEND */

  drawFrequencyLegend(
    svg,
    width,
    height,
    scale
  );
}

/* =========================================
   FREQUENCY LEGEND
========================================= */

function drawFrequencyLegend(
  svg,
  width,
  height,
  scale
) {
  svg
    .selectAll("g.frequency-legend")
    .remove();

  const legend = svg
    .append("g")
    .attr("class", "frequency-legend");

  const legendX = width * 0.05;
  const legendY = height * 0.78;

  const fontSize = Math.max(
    9,
    Math.min(14, width * 0.03)
  );

  const circleGroup = legend
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 1);

  /* MORE FREQUENT */

  circleGroup
    .append("circle")
    .attr("cx", legendX)
    .attr("cy", legendY)
    .attr("r", 11 * scale);

  /* LESS FREQUENT */

  circleGroup
    .append("circle")
    .attr("cx", legendX)
    .attr("cy", legendY + 30 * scale)
    .attr("r", 5 * scale);

  /* LABELS */

  const text = legend
    .append("g")
    .attr("fill", "white")
    .attr("font-family", "Inter, sans-serif")
    .attr("font-size", fontSize);

  text
    .append("text")
    .text("More frequent")
    .attr("x", legendX + 20 * scale)
    .attr("y", legendY + 4);

  text
    .append("text")
    .text("Less frequent")
    .attr("x", legendX + 20 * scale)
    .attr("y", legendY + 30 * scale + 4);
}

/* =========================================
   CIRCLE RADIUS
========================================= */

function getRadius(value) {
  if (value <= 100) return 5;
  if (value <= 500) return 7;
  if (value <= 5000) return 9;
  return 11;
}

/* =========================================
   TOOLTIP — SHOW
========================================= */

function showSymptomTooltip(
  event,
  d,
  tooltipElement
) {
  if (!tooltipElement) return;

  d3.select(tooltipElement)
    .html(getTooltipHtml(d))
    .interrupt()
    .style("opacity", 1);

  moveSymptomTooltip(
    event,
    tooltipElement
  );
}

/* =========================================
   TOOLTIP — MOVE
========================================= */

function moveSymptomTooltip(
  event,
  tooltipElement
) {
  if (!tooltipElement) return;

  const tooltip = d3.select(tooltipElement);

  const rect =
    tooltipElement.getBoundingClientRect();

  const offset = 18;
  const padding = 12;

  let x = event.clientX + offset;
  let y = event.clientY + offset;

  if (
    x + rect.width >
    window.innerWidth - padding
  ) {
    x = event.clientX - rect.width - offset;
  }

  if (
    y + rect.height >
    window.innerHeight - padding
  ) {
    y = event.clientY - rect.height - offset;
  }

  x = Math.max(padding, x);
  y = Math.max(padding, y);

  tooltip
    .style("left", `${x}px`)
    .style("top", `${y}px`);
}

/* =========================================
   TOOLTIP — HIDE
========================================= */

function hideSymptomTooltip(
  tooltipElement
) {
  if (!tooltipElement) return;

  d3.select(tooltipElement)
    .interrupt()
    .transition()
    .duration(150)
    .style("opacity", 0);
}

/* =========================================
   TOOLTIP HTML
========================================= */

function getTooltipHtml(d) {
  const title = escapeHtml(d.name);

  const description = escapeHtml(
    d.hovertext || ""
  );

  return `
    <div style="line-height:1.5;">
      <strong style="font-size:15px;">
        ${title}
      </strong>
      ${
        description
          ? `<p style="margin-top:8px;">
               ${description}
             </p>`
          : ""
      }
    </div>
  `;
}

/* =========================================
   HTML ESCAPING
========================================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
