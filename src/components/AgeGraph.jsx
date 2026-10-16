
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  useResizeObserver,
  useDebounceCallback,
} from "usehooks-ts";

const ageData = [
  { age: "0-25", value: 0 },
  { age: "26–29", value: 100 },
  { age: "30–34", value: 400 },
  { age: "35–40", value: 1000 },
  { age: "41–45", value: 2000 },
  { age: "46–50", value: 400 },
];

function AgeGraph() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

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

  useEffect(() => {
    if (
      !svgRef.current ||
      size.width <= 0 ||
      size.height <= 0
    ) {
      return;
    }

    const isMobile = size.width <= 400;

    const margin = {
      top: 22,
      right: isMobile ? 28 : 25,
      bottom: 68,
      left: isMobile ? 62 : 70,
    };

    const width = size.width;
    const height = size.height;

    const plotBottom = height - margin.bottom;

    const svg = d3.select(svgRef.current);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    svg.selectAll("*").remove();

    // ---------------- SCALES ----------------

    const x = d3
      .scalePoint()
      .domain(ageData.map((d) => d.age))
      .range([
        margin.left,
        width - margin.right,
      ]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(ageData, (d) => d.value),
      ])
      .nice()
      .range([
        plotBottom,
        margin.top,
      ]);

    // ---------------- X AXIS ----------------

    const xAxis = svg
      .append("g")
      .attr(
        "transform",
        `translate(0,${plotBottom})`
      )
      .call(d3.axisBottom(x))
      .style(
        "font-size",
        isMobile ? "10px" : "12px"
      );

    xAxis
      .selectAll("text")
      .attr("fill", "white")
      .attr("dy", "1em");

    // ---------------- Y AXIS ----------------

    const yAxis = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},0)`
      )
      .call(d3.axisLeft(y).ticks(5))
      .style(
        "font-size",
        isMobile ? "10px" : "12px"
      );

    yAxis
      .selectAll("text")
      .attr("fill", "white");

    // ---------------- X AXIS TITLE ----------------
    // Positioned relative to the X-axis,
    // NOT relative to the bottom of the SVG.

    svg
      .append("text")
      .text("Age Range")
      .attr("x", (margin.left + width - margin.right) / 2)
      .attr("y", plotBottom + 45)
      .attr("font-size", isMobile ? "12px" : "15px")
      .attr("font-weight", "500")
      .attr("fill", "white")
      .attr("text-anchor", "middle");

    // ---------------- Y AXIS TITLE ----------------

    svg
      .append("text")
      .text("Mentions")
      .attr("font-size", isMobile ? "12px" : "15px")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(20,${
          (plotBottom + margin.top) / 2
        }) rotate(-90)`
      );

    // ---------------- CURVE ----------------

    const line = d3
      .line()
      .x((d) => x(d.age))
      .y((d) => y(d.value))
      .curve(
        d3.curveCatmullRom.alpha(0.6)
      );

    svg
      .append("path")
      .datum(ageData)
      .attr("fill", "none")
      .attr("stroke", "#fcf9f9")
      .attr("stroke-width", 4)
      .attr("d", line);

    // ---------------- HOVER LINE ----------------

    const hoverLine = svg
      .append("line")
      .attr("y1", margin.top)
      .attr("y2", plotBottom)
      .attr("stroke", "#f6f4f4")
      .attr("stroke-dasharray", "4 4")
      .attr("stroke-width", 3)
      .style("opacity", 0);

    // ---------------- HOVER LABEL ----------------

    const hoverLabel = svg
      .append("text")
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#f6f5f5")
      .style("opacity", 0);

    // ---------------- INTERACTION ----------------

    svg
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr(
        "width",
        Math.max(
          0,
          width - margin.left - margin.right
        )
      )
      .attr(
        "height",
        Math.max(
          0,
          plotBottom - margin.top
        )
      )
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);

        const closest = ageData.reduce(
          (a, b) =>
            Math.abs(x(a.age) - mouseX) <
            Math.abs(x(b.age) - mouseX)
              ? a
              : b
        );

        const cx = x(closest.age);

        hoverLine
          .attr("x1", cx)
          .attr("x2", cx)
          .style("opacity", 1);

        hoverLabel
          .attr("x", cx)
          .text(closest.age)
          .style("opacity", 1);
      })
      .on("mouseleave", () => {
        hoverLine.style("opacity", 0);
        hoverLabel.style("opacity", 0);
      });
  }, [size.width, size.height]);

  return (
    <div
      ref={containerRef}
      className="age-panel w-full h-full"
      style={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

export default AgeGraph;
