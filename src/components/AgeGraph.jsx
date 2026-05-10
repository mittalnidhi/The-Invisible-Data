import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';

const ageData = [
    { age: "26–29", value: 100 },
    { age: "30–34", value: 400 },
    { age: "35–40", value: 1000 },
    { age: "41–45", value: 2000 },
    { age: "46–50", value: 200 },
];

function AgeGraph() {
    const svgRef = useRef();
	// Adjust circles on resize
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size) => setSize(size), 200);
    useResizeObserver({ ref: svgRef, onResize });

    useEffect(() => {
		if(size.width === 0 || size.height === 0) return;

        const margin = { top: 20, right: 20, bottom: 50, left: 70 };

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // ---------------- scales ----------------
        const x = d3.scalePoint()
            .domain(ageData.map((d) => d.age))
            .range([margin.left, size.width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(ageData, (d) => d.value)])
            .nice()
            .range([size.height - margin.bottom, margin.top]);

        // ---------------- axes ----------------
		svg.append("g")
			.attr("transform", `translate(0,${size.height - margin.bottom})`)
			.call(d3.axisBottom(x))
			.style("font-size", size.width > 400 ? "10pt" : "8pt");

		svg.append("g")
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).ticks(5))
			.style("font-size", size.width > 400 ? "10pt" : "8pt");

		// ------------- axes labels -------------
		svg.append("text")
			.text("Age Range")
			.attr("font-size", size.width > 400 ? "12pt" : "9pt")
			.attr("fill", "white")
			.attr("text-anchor", "middle")
			.attr("transform", `translate(${(size.width - margin.right + margin.left) / 2}, ${size.height - 5})`)
		svg.append("text")
			.text("Mentions")
			.attr("font-size", size.width > 400 ? "12pt" : "9pt")
			.attr("fill", "white")
			.attr("text-anchor", "middle")
			.attr("transform", `translate(20, ${(size.height - margin.bottom + margin.top) / 2}) rotate(-90)`)

        // ---------------- curve ----------------
        const line = d3
            .line()
            .x((d) => x(d.age))
            .y((d) => y(d.value))
            .curve(d3.curveCatmullRom.alpha(0.6));

        svg.append("path")
            .datum(ageData)
            .attr("fill", "none")
            .attr("stroke", "#fcf9f9")
            .attr("stroke-width", 4)
            .attr("d", line);

        // ---------------- hover line ----------------
        const hoverLine = svg
            .append("line")
            .attr("y1", margin.top)
            .attr("y2", size.height - margin.bottom)
            .attr("stroke", "#f6f4f4")
            .attr("stroke-dasharray", "4 4")
            .attr("stroke-width", 3)
            .style("opacity", 0);

        // ---------------- hover label ----------------
        const hoverLabel = svg
            .append("text")
            .attr("y", margin.top - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#f6f5f5")
            .style("opacity", 0);

        // ---------------- interaction overlay ----------------
        svg.append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", size.width - margin.left - margin.right)
            .attr("height", size.height - margin.top - margin.bottom)
            .attr("fill", "transparent")
            .on("mousemove", (event) => {
                const [mouseX] = d3.pointer(event);

                // find closest age bucket
                const closest = ageData.reduce((a, b) =>
                    Math.abs(x(a.age) - mouseX) < Math.abs(x(b.age) - mouseX)
                        ? a
                        : b,
                );

                const cx = x(closest.age);

                hoverLine.attr("x1", cx).attr("x2", cx).style("opacity", 1);

                hoverLabel.attr("x", cx).text(closest.age).style("opacity", 1);
            })
            .on("mouseleave", () => {
                hoverLine.style("opacity", 0);
                hoverLabel.style("opacity", 0);
            });
    }, [size]);

    return (
        <div className="age-panel w-full h-full">
            <svg ref={svgRef} width='100%' height='100%' />
        </div>
    );
}

export default AgeGraph;
