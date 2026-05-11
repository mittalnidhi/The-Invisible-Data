import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import peridata from '../data/peridata.json';
import colorMap from '../data/colorMap.json';

export default function ClusterSilhouette(props){
    const svgRef = useRef(null);
    const circlesRef = useRef(null);
    const linesRef = useRef(null);
    const tooltipRef = useRef(null);

    // Adjust circles on resize
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size) => setSize(size), 200);
    useResizeObserver({ ref: svgRef, onResize });

    // Create array for drawing
    let data = [];
    for (const category of peridata.symptoms.children){
        for (const symptom of category.children){
            for (let i = 0; i < symptom.x.length; i++){
                data.push({
                    name: symptom.name,
                    value: symptom.value,
                    category: category.name,
                    x: symptom.x[i],
                    y: symptom.y[i],
                    hovertext: symptom.hovertext
                })
            }
        }
    }

    useEffect(() => {
        if(data.length === 0) return;
        if(size.width === 0 || size.height === 0) return;
        plotPoints(svgRef.current, circlesRef.current, linesRef.current, tooltipRef.current, data, size, props);
    }, [size, props.currentNeighbors]);

    return (
        <div className='silhouette absolute h-19/20 aspect-[1241/1754] -top-full -bottom-full -left-full -right-full m-auto'>
            <div ref={tooltipRef} className='tooltip'></div>
            <svg ref={svgRef} width='100%' height='100%'>
                <g ref={linesRef}></g>
                <g ref={circlesRef}></g>
            </svg>
        </div>
    )
}

function plotPoints(svgElement, circlesGrp, linesGrp, tooltipElement, data, size, props){
    // Pre filter data to allow drawing of links
    const neighbors = [];
    let selected = null;
    if(props.currentSymptom !== ''){
        for(const d of data){
            if(d.name === props.currentSymptom) selected = d;
            if(props.currentNeighbors.includes(d.name)) neighbors.push(d)
        }
    }

    // Draw links if a symptom is selected
    d3.select(linesGrp).selectAll('line').remove();
    if(props.currentSymptom !== ''){
        d3.select(linesGrp).selectAll('line')
            .data(neighbors)
            .join('line')
            .attr('x1', selected.x * size.width)
            .attr('y1', selected.y * size.height)
            .attr('x2', d => d.x * size.width)
            .attr('y2', d => d.y * size.height)
            .attr('fill', 'none')
            .attr('stroke', colorMap[selected.category])
            .attr('stroke-width', 1.5)
            .classed('marching-3', true)
    }

    d3.select(circlesGrp).selectAll('circle')
        // d => d.name is the identifier for enter/update/exit
        .data(neighbors.length > 0 ? [...neighbors, selected] : data, d => `${d.name} ${d.x} ${d.y}`)
        .join(
            function(enter){
                const circles = enter.append('circle')
                    .attr('cx', d => d.x * size.width)
                    .attr('cy', d => d.y * size.height)
                    .attr('r', 0)
                    .attr('fill', d => colorMap[d.category])
                    .attr('stroke', '#555')
                    .attr('stroke-width', 1)
                    .style('cursor', 'pointer')
                    .on('mouseover', function(e, d) {
                        d3.select(tooltipElement)
                            .html(getTooltipHtml(d))
                            .style('left', `${e.clientX - 200}px`)
                            .style('top', `${e.clientY + 20}px`)
                            .transition()
                            .duration(150)
                            .style('opacity', 1)
                        d3.select(this)
                            .transition()
                            .duration(150)
                            .attr('stroke', 'black')
                            .attr('stroke-width', 2)
                    })
                    .on('mousemove', function(e) {
                        d3.select(tooltipElement)
                            .style('left', `${e.clientX - 200}px`)
                            .style('top', `${e.clientY + 20}px`)
                    })
                    .on('mouseout', function(e) {
                        d3.select(tooltipElement)
                            .transition()
                            .duration(150)
                            .style('opacity', 0)
                        d3.select(this)
                            .transition()
                            .duration(150)
                            .attr('stroke', '#555')
                            .attr('stroke-width', 1)
                    })
                    .on('click', (e, d) => props.setCurrentSymptom((prev) => prev !== d.name ? d.name : ''))
                
                circles.transition()
                    .duration(200)
                    .attr('r', function(d){
                        if(props.currentSymptom === d.name) return 8;
                        return 6;
                    })
            },
            function(update){
                update
                    .transition()
                    .duration(200)
                    .attr('cx', d => d.x * size.width)
                    .attr('cy', d => d.y * size.height)
            },
            function(exit){
                exit
                    .transition()
                    .duration(200)
                    .attr('r', 0)
                    .remove()
            }
        );
}

function getTooltipHtml(d){
    if(d.hovertext !== ""){
        return (
                `<h5 class='text-lg font-semibold'>${d.name}</h5>
                <br />
                <p>${d.hovertext}</p>`
        )
    } else {
        return `<h5 class='text-lg font-semibold'>${d.name}</h5>`
    }
}