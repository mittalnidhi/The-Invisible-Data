import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { showTooltip, moveTooltip, hideTooltip } from '../utils';
import "./HormoneGraph.css";

export default function HormoneGraph(props) {
    const svgRef = useRef(null);
	const tooltipRef = useRef(null);

	// Adjust circles on resize
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size) => setSize(size), 200);
    useResizeObserver({ ref: svgRef, onResize });

    const hormones = [
        {
            name: "Estrogen",
            color: "#E07A7A",
            relation:
                "Estrogen fluctuates widely in perimenopause. Drops in estrogen trigger rising FSH levels as the body attempts to stimulate the ovaries. Estrogen instability also disrupts progesterone balance.",
            values: [
                { age: 35, value: 80 },
                { age: 38, value: 65 },
                { age: 41, value: 90 },
                { age: 44, value: 55 },
                { age: 47, value: 40 },
                { age: 50, value: 25 },
            ],
        },
        {
            name: "Progesterone",
            color: "#9C89B8",
            relation:
                "Progesterone often declines earlier than estrogen due to irregular ovulation. Lower progesterone reduces estrogen stability and contributes to sleep disruption and anxiety.",
            values: [
                { age: 35, value: 70 },
                { age: 38, value: 55 },
                { age: 41, value: 45 },
                { age: 44, value: 30 },
                { age: 47, value: 20 },
                { age: 50, value: 10 },
            ],
        },
        {
            name: "FSH",
            color: "#6FA8DC",
            relation:
                "FSH increases as estrogen declines. Rising FSH is not a cause of symptoms but a response to reduced ovarian sensitivity — a core hormonal signal of perimenopause.",
            values: [
                { age: 35, value: 20 },
                { age: 38, value: 30 },
                { age: 41, value: 45 },
                { age: 44, value: 70 },
                { age: 47, value: 85 },
                { age: 50, value: 95 },
            ],
        },
        {
            name: "LH",
            color: "#88B7A5",
            relation:
                "LH becomes irregular as ovulation timing changes. Disrupted LH signaling reflects hormonal communication breakdown rather than absolute deficiency.",
            values: [
                { age: 35, value: 30 },
                { age: 38, value: 40 },
                { age: 41, value: 45 },
                { age: 44, value: 55 },
                { age: 47, value: 65 },
                { age: 50, value: 75 },
            ],
        },
        {
            name: "Testosterone",
            color: "#F2B880",
            relation:
                "Testosterone gradually declines with age. While subtler than estrogen shifts, its reduction contributes to fatigue, reduced libido, and muscle changes.",
            values: [
                { age: 35, value: 60 },
                { age: 38, value: 55 },
                { age: 41, value: 50 },
                { age: 44, value: 45 },
                { age: 47, value: 40 },
                { age: 50, value: 35 },
            ],
        },
    ];

    useEffect(() => {
        if(size.width === 0 || size.height === 0) return;
        const margin = { top: 10, right: 10, bottom: 50, left: 60 };

        function filterHormones(h){
            if(props.currentOption === '') return true;
            return props.currentOption === h
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const x = d3.scaleLinear()
            .domain([35, 50])
            .range([margin.left, size.width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([size.height - margin.bottom, margin.top]);

        const area = d3.area()
            .x((d) => x(d.age))
            .y0(size.height - margin.bottom)
            .y1((d) => y(d.value))
            .curve(d3.curveCatmullRom);

        const line = d3.line()
            .x((d) => x(d.age))
            .y((d) => y(d.value))
            .curve(d3.curveCatmullRom);

		const curveFill = svg.append("g")
		const curve = svg.append("g")

        hormones.filter(h => filterHormones(h.name)).forEach((h) => {
            curveFill.append("path")
                .datum(h.values)
                .attr("fill", "#BBB")
                .attr("opacity", 0.2)
                .attr("d", area)
				.attr("pointer-events", "none");

            const path = curve.append("path")
                .datum(h.values)
                .attr("class", "hormone-line")
                .attr("data-name", h.name)
                .attr("d", line);

            const length = path.node().getTotalLength();

            path.attr("stroke-dasharray", length)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration(1600)
                .ease(d3.easeCubicOut)
                .attr("stroke-dashoffset", 0);

            path
				.on("mouseover", function(e){
					const text = `<p style="font-size: 12pt; color: white";>${h.name}</p><br /><p>${h.relation}</p>`;
					showTooltip(e, text, tooltipRef.current, 'center')
				})
				.on("mouseout", () => hideTooltip(tooltipRef.current));
        });

		// Draw axes
        svg.append("g")
            .attr("transform", `translate(0,${size.height - margin.bottom})`)
            .call(d3.axisBottom(x))
			.style("font-size", size.width > 400 ? "10pt" : "8pt");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(size.height > 200 ? 10 : 5))
			.style("font-size", size.width > 400 ? "10pt" : "8pt");

		// Axis labels
		svg.append("text")
			.text("Age")
			.attr("font-size", size.width > 400 ? "12pt" : "9pt")
			.attr("fill", "white")
			.attr("text-anchor", "middle")
			.attr("transform", `translate(${(size.width - margin.right + margin.left) / 2}, ${size.height - 5})`)
		svg.append("text")
			.text("Amount")
			.attr("font-size", size.width > 400 ? "12pt" : "9pt")
			.attr("fill", "white")
			.attr("text-anchor", "middle")
			.attr("transform", `translate(20, ${(size.height - margin.bottom + margin.top) / 2}) rotate(-90)`)

    }, [size, props.currentOption]);

    return (
        <div className="relative w-full h-full">
            <svg ref={svgRef} width='100%' height='100%' />
			<div ref={tooltipRef} className="tooltip"></div>
        </div>
    );
}
