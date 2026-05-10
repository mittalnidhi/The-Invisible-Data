import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import filterdata from '../data/filterData.json';
import colorMap from '../data/colorMap.json';

export default function ColonySilhouette(props){
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    const legendRef = useRef(null);

    // Adjust circles on resize
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size) => setSize(size), 200);
    useResizeObserver({ ref: svgRef, onResize });

    // Create array for drawing
    let data = [];
    for (const category of props.peridata){
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

    // Define filter functions
    function categoryFilter(d){
        if(props.currentCategory !== ''){
            return props.currentCategory === d.category;
        } else {
            return true
        }
    }

    function viewFilter(d){
        if(filterdata[props.currentView]) return filterdata[props.currentView].includes(d.name);
        return true;
    }
    
    function stageFilter(d){
        if(filterdata[props.currentStage]) return filterdata[props.currentStage].includes(d.name);
        return true;
    }

    function hormoneFilter(d){
        if(filterdata[props.currentHormone]) return filterdata[props.currentHormone].includes(d.name);
        return true;
    }

    const filters = [categoryFilter, viewFilter, stageFilter, hormoneFilter];

    useEffect(() => {
        if(data.length === 0) return;
        if(size.width === 0 || size.height === 0) return;
        plotPoints(svgRef.current, tooltipRef.current, data, filters, size);
        drawLegend(legendRef.current, size);
    }, [size, props.currentCategory, props.currentView, props.currentStage, props.currentHormone]);

    return (
        <div className='silhouette relative h-full aspect-[1241/1754] mx-auto'>
            <div ref={tooltipRef} id='colony-tooltip' className='fixed w-100 text-sm p-2 rounded-md'></div>
            <svg ref={svgRef} width='100%' height='100%'></svg>
            <svg ref={legendRef} className='absolute bottom-[-30px]' width='100%' height='10vh'></svg>
        </div>
    )
}

function plotPoints(svgElement, tooltipElement, data, filters, size){
    const sizeRatio = size.width / 700;
    const svg = d3.select(svgElement)
    svg.selectAll('circle')
        // d => d.name is the identifier for enter/update/exit
        .data(data.filter(d => filterSymptoms(d, filters)).toSorted((a, b) => b.value - a.value), d => d.name)
        .join(
            function(enter){
                const circles = enter.append('circle')
                    .attr('cx', d => d.x * size.width)
                    .attr('cy', d => d.y * size.height)
                    .attr('r', 0)
                    .attr('fill', d => colorMap[d.category])
                    // .attr('stroke', '#555')
                    // .attr('stroke-width', 1)
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
                
                circles.transition()
                    .duration(200)
                    .attr('r', d => getRadius(d.value) * sizeRatio)
            },
            function(update){
                update
                    .transition()
                    .duration(200)
                    .attr('cx', d => d.x * size.width)
                    .attr('cy', d => d.y * size.height)
                    .attr('r', d => getRadius(d.value) * sizeRatio)
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

function filterSymptoms(d, filters){
    let result = true;
    for(const f of filters){
        result &= f(d);
    }
    return result;
}

function getRadius(value){
    if(value <= 100) return 5;          
    if(value <= 500) return 7;
    if(value <= 5000) return 9;
    return 11;
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

function drawLegend(legendElement, size){
    const sizeRatio = size.width / 700;

    const svg = d3.select(legendElement);
    svg.selectAll('*').remove();

    const circles = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)

    circles.append('circle')
        .attr('cx', sizeRatio * 11 + 1)
        .attr('cy', sizeRatio * 11 + 20)
        .attr('r', sizeRatio * 11)
    
    // circles.append('circle')
    //     .attr('cx', sizeRatio * 11 + 1)
    //     .attr('cy', sizeRatio * 13 + 20)
    //     .attr('r', sizeRatio * 9)
    
    // circles.append('circle')
    //     .attr('cx', sizeRatio * 11 + 1)
    //     .attr('cy', sizeRatio * 15 + 20)
    //     .attr('r', sizeRatio * 7)

    circles.append('circle')
        .attr('cx', sizeRatio * 11 + 1)
        .attr('cy', sizeRatio * 17 + 40)
        .attr('r', sizeRatio * 5)

    const text = svg.append('g')
        .attr('fill', 'white')
        .attr('font-size', 15)

    text.append('text')
        .text('More frequent')
        .attr('x', sizeRatio * 11 + 20)
        .attr('y', 32)
    
    text.append('text')
        .text('Less frequent')
        .attr('x', sizeRatio * 11 + 20)
        .attr('y', 57)

    // text.append('text')
    //     .text('≤ 15000')
    //     .attr('x', sizeRatio * 11 + 30)
    //     .attr('y', 6)

    // text.append('text')
    //     .text('≤ 5000')
    //     .attr('x', sizeRatio * 11 + 30)
    //     .attr('y', 18)

    // text.append('text')
    //     .text('≤ 100')
    //     .attr('x', sizeRatio * 11 + 30)
    //     .attr('y', 30)

    // text.append('text')
    //     .text('≤ 100')
    //     .attr('x', sizeRatio * 11 + 30)
    //     .attr('y', 42)

    

    // const lines = svg.append('g')
    //     .attr('fill', 'none')
    //     .attr('stroke', 'white')
    //     .attr('stroke-width', 1)
    
    // lines.append('line')
    //     .attr('x1', sizeRatio * 11 + 1)
    //     .attr('y1', 20)
    //     .attr('x2', sizeRatio * 11 + 25)
    //     .attr('y2', 4)

    // lines.append('line')
    //     .attr('x1', sizeRatio * 11 + 1)
    //     .attr('y1', sizeRatio * 4 + 20)
    //     .attr('x2', sizeRatio * 11 + 25)
    //     .attr('y2', 16)

    // lines.append('line')
    //     .attr('x1', sizeRatio * 11 + 1)
    //     .attr('y1', sizeRatio * 8 + 20)
    //     .attr('x2', sizeRatio * 11 + 25)
    //     .attr('y2', 28)

    // lines.append('line')
    //     .attr('x1', sizeRatio * 11 + 1)
    //     .attr('y1', sizeRatio * 12 + 20)
    //     .attr('x2', sizeRatio * 11 + 25)
    //     .attr('y2', 40)

}