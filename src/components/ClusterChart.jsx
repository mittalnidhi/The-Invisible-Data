import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import clusterData from '../data/symptomClusters.json';
import colorMap from '../data/colorMap.json';
import { showTooltip, moveTooltip, hideTooltip } from '../utils';

const drawParams = {
    sizeClear: d => 5 * getRadius(d.value),
    sizeSelected: d => 15 * getRadius(d.value),
    sizeNeighbor: d => 8 * getRadius(d.value),
    fillEnabled: d => colorMap[d.group],
    fillDisabled: '#EEE',
    strokeClear: d => d.weight,
    strokeEnabled: d => 5 * Math.pow(d.weight, 3),
    strokeDisabled: 0
}

// Force parameters for easy adjustments
const forces = {
    chargeClear: -50,          // Negative for repulsion
    chargeSelected: -600,
    chargeNeighbor: -900,
    chargeNotSelected: -50,
    collideClear: d => 10 * getRadius(d.value),
    collideSelected: d => 20 * getRadius(d.value),
    collideNeighbor: d => 12 * getRadius(d.value),
    collideNotSelected: d => 8 * getRadius(d.value),
    linkClear: d => 0.5 * Math.pow(d.weight, 4),
    linkSelected: d => 0.65 * Math.pow(d.weight, 2),
    linkNotSelected: d => 0.1 * d.weight,
    xyGrpSelected: 0.1,
    xyGrpNeighbor: 0.5,
    xyGrpDeselected: 1,
    xyCtrSelected: 0.9,
    xyCtrDeselected: 0,
    xyCtrNeighbor: 0.5
}

// Copy data structure for simulation to mutate
const nodes = clusterData.nodes.map(d => ({...d}));
const links = clusterData.links.map(d => ({...d}));
const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).strength(forces.linkClear))
    .force('charge', d3.forceManyBody().strength(forces.chargeClear).distanceMax(500))
    .force('collide', d3.forceCollide().radius(forces.collideClear))
    .force('xGroup', d3.forceX(0).strength(forces.xyGrpDeselected))
    .force('yGroup', d3.forceY(0).strength(forces.xyGrpDeselected))
    .force('xCentripetal', d3.forceX(0).strength(forces.xyCtrDeselected))
    .force('yCentripetal', d3.forceY(0).strength(forces.xyCtrDeselected))

export default function ClusterChart(props){
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    const circleGrpRef = useRef(null);
    const lineGrpRef = useRef(null);

    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size) => setSize(size), 200);
    useResizeObserver({ ref: svgRef, onResize });

    useEffect(() => {
        if(size.width === 0 || size.height === 0) return;
        // Update size-dependent draw parameters
        drawParams.sizeClear = d => size.width * getRadius(d.value) / 80;
        drawParams.sizeSelected = d => size.width * getRadius(d.value) / 27;
        drawParams.sizeNeighbor = d => size.width * getRadius(d.value) / 50;
        // Update size-dependent forces
        forces.collideClear = d => size.width * getRadius(d.value) / 60;
        forces.collideSelected = d => size.width * getRadius(d.value) / 20;
        forces.collideNeighbor = d => size.width * getRadius(d.value) / 33;
        forces.collideNotSelected = d => size.width * getRadius(d.value) / 60;
        simulation.force('xGroup').x(d => clusterXY(d.group, 'x', size));
        simulation.force('yGroup').y(d => clusterXY(d.group, 'y', size));
        simulation.force('xCentripetal').x(size.width / 2);
        simulation.force('yCentripetal').y(size.height / 2);
        drawChart(tooltipRef.current, circleGrpRef.current, lineGrpRef.current, props, size);
        simulation.alphaTarget(0.3).restart();
        setTimeout(() => simulation.alphaTarget(0), 2000);
    }, [size]);

    // When a new symptom is selected, update neighbors list accordingly
    useEffect(() => {
        if(props.currentSymptom === ''){
            props.setCurrentNeighbors([]);

            // Stop lines from animating
            d3.select(lineGrpRef.current)
                .selectChildren('path')
                .classed('paused', true);
        }
        else {
            const neighbors = new Set();
            for(const link of links){
                if(link.source.id === props.currentSymptom) neighbors.add(link.target.id);
            }
            // Add a dummy element if no links are defined
            if(neighbors.size == 0){
                neighbors.add(props.currentSymptom)
            }
            props.setCurrentNeighbors([...neighbors]);
            
            // Animate lines
            d3.select(lineGrpRef.current)
                .selectChildren('path')
                .classed('paused', false);
        }
    }, [props.currentSymptom])

    useEffect(() => {
        const circles = d3.select(circleGrpRef.current).selectAll('circle');
        if(circles.size() < 1) return;
        // Emphasize selected nodes and gray out others
        const radiusScalar = size.width / 400;
        circles
            .data(nodes)
            .transition().duration(200)
            .attr('r', function(d){
                if(d.id === props.currentSymptom) return drawParams.sizeSelected(d);
                if(props.currentNeighbors.includes(d.id)) return drawParams.sizeNeighbor(d);
                return drawParams.sizeClear(d);
            })
            .attr('fill', function(d){
                if(props.currentSymptom === '') return drawParams.fillEnabled(d);
                if(props.currentNeighbors.includes(d.id) || d.id === props.currentSymptom) return drawParams.fillEnabled(d);
                else return drawParams.fillDisabled;
            })
        // Emphasize selected connections and hide others
        const lines = d3.select(lineGrpRef.current).selectAll('path');
        lines
            .data(links)
            .transition().duration(200)
            .attr('stroke-width', function(d){
                if(props.currentSymptom === '') return drawParams.strokeClear(d);
                if(d.source.id === props.currentSymptom) return drawParams.strokeEnabled(d);
                return drawParams.strokeDisabled;
            })

        // Adjust many body forces according to selection
        simulation.force('charge').strength(function(d){
            if(props.currentSymptom === '') return forces.chargeClear;
            if(props.currentSymptom === d.id) return forces.chargeSelected;
            if(props.currentNeighbors.includes(d.id)) return forces.chargeNeighbor;
            return forces.chargeNotSelected;
        });
        // Adjust collision forces according to selection
        simulation.force('collide').radius(function(d){
            if(props.currentSymptom === '') return forces.collideClear(d);
            if(props.currentSymptom === d.id) return forces.collideSelected(d);
            if(props.currentNeighbors.includes(d.id)) return forces.collideNeighbor(d);
            return forces.collideNotSelected(d);
        })
        // Adjust collision forces according to selection
        simulation.force('link').strength(function(d){
            if(props.currentSymptom === '') return forces.linkClear(d);
            if(props.currentSymptom === d.source.id) return forces.linkSelected(d);
            return forces.linkNotSelected(d);
        })
        // Adjust cluster-directed position forces according to selection
        simulation.force('xGroup').strength(function(d){
            if(props.currentSymptom === d.id) return forces.xyGrpSelected;
            if(props.currentNeighbors.includes(d.id)) return forces.xyGrpNeighbor;
            return forces.xyGrpDeselected;
        });
        simulation.force('yGroup').strength(function(d){
            if(props.currentSymptom === d.id) return forces.xyGrpSelected;
            if(props.currentNeighbors.includes(d.id)) return forces.xyGrpNeighbor;
            return forces.xyGrpDeselected;
        });
        // Adjust centripetal position forces according to selection
        simulation.force('xCentripetal').strength(function(d){
            if(props.currentSymptom === d.id) return forces.xyCtrSelected;
            if(props.currentNeighbors.includes(d.id)) return forces.xyCtrNeighbor;
            return forces.xyCtrDeselected;
        });
        simulation.force('yCentripetal').strength(function(d){
            if(props.currentSymptom === d.id) return forces.xyCtrSelected;
            if(props.currentNeighbors.includes(d.id)) return forces.xyCtrNeighbor;
            return forces.xyCtrDeselected;
        });

        // Reheat the animation in case the selection is changed from another component
        simulation.alphaTarget(0.1).restart();
        setTimeout(() => simulation.alphaTarget(0), 2000);
    }, [props.currentNeighbors]);

    return (
        <div className='w-full h-full'>
            <div ref={tooltipRef} className='tooltip'></div>
            <svg ref={svgRef} width='100%' height='100%'>
                <g ref={lineGrpRef}></g>
                <g ref={circleGrpRef}></g>
            </svg>
        </div>
    )
}

function drawChart(tooltipElement, circleGrp, lineGrp, props, size){
    // Draw the lines
    // const lines = d3.select(lineGrp)        
    //     .selectAll('line')
    //     .data(links, d => `${d.source.id} -> ${d.target.id}`)
    //     .join('line')
    //     .attr('stroke-opacity', d => d.weight)
    //     .attr('stroke-width', d => Math.pow(d.weight, 2))
    //     .attr('stroke', d => colorMap[d.source.group])
    //     .classed('marching-6 paused', true)
    
    const curves = d3.select(lineGrp)
        .selectAll('path')
        .data(links, d => `${d.source.id} -> ${d.target.id}`)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke-opacity', d => d.weight)
        .attr('stroke-width', d => Math.pow(d.weight, 2))
        .attr('stroke', d => colorMap[d.source.group])
        .classed('marching-6 paused', true)
    
    // Draw the circles
    const circles = d3.select(circleGrp)
        .selectAll('circle')
        .data(nodes, d => d.id)
        .join('circle')
        .attr('r', d => drawParams.sizeClear(d))
        .attr('fill', d => colorMap[d.group])
        .style('filter', 'drop-shadow(0px 1px 2px black)')
        .style('cursor', 'pointer')
        .on('click', function(e, d){
            props.setCurrentSymptom((prev) => d.id !== prev ? d.id : '')
        })
        .on('mouseover', (e, d) => showTooltip(e, getTooltipHtml(d), tooltipElement, 'center'))
        .on('mousemove', (e) => moveTooltip(e, tooltipElement, 'center'))
        .on('mouseout', () => hideTooltip(tooltipElement))
    
    simulation.on('tick', () => {
        curves
            .attr('d', d => calcQuadraticPath(d.source.x, d.source.y, d.target.x, d.target.y))
        // lines
        //     .attr('x1', d => d.source.x)
        //     .attr('y1', d => d.source.y)
        //     .attr('x2', d => d.target.x)
        //     .attr('y2', d => d.target.y);
        circles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });

    // Attach dragging behavior to nodes
    circles.call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
    )
}

function clusterXY(category, axis, size){
    switch (category) {
    case 'Vasomotor':
        return axis === 'x' ? size.width*0.5 : size.height*0.85;
    case 'Cognitive':
        return axis === 'x' ? size.width*0.9 : size.height*0.85;
    case 'Psychological & Emotional':
        return axis === 'x' ? size.width*0.5 : size.height*0.15;
    case 'Sleep':
        return axis === 'x' ? size.width*0.9 : size.height*0.5;
    case 'Urological & Sexual':
        return axis === 'x' ? size.width*0.1 : size.height*0.5;
    case 'Dermatological & Sensory':
        return axis === 'x' ? size.width*0.1 : size.height*0.85;
    case 'Physical':
        return axis === 'x' ? size.width*0.85 : size.height*0.2;
    case 'Menstrual':
        return axis === 'x' ? size.width*0.1 : size.height*0.15;
    default:
        return axis === 'x' ? size.width*0.5 : size.height*0.5;
  }
}

// Reheat the simulation when drag starts, and lock the dragged node's position.
function dragStarted(event) {
    if (!event.active) simulation.alphaTarget(0.1).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}

// Move the dragged node
function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}

// Cool sim after dragging ends.
// Unlock dragged node's position upon release.
function dragEnded(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}

function calcQuadraticPath(startX, startY, endX, endY) {
    if(startX == endX && startY == endY){
        return `M ${startX} ${startY} L ${endX} ${endY}`
    }
    const vecX = endX - startX;
    const vecY = endY - startY;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const perpX = vecY;
    const perpY = -vecX;
    const dist = Math.sqrt(vecX*vecX + vecY*vecY);
    const distPerp = Math.sqrt(perpX*perpX + perpY*perpY);
    const perpNormX = perpX / distPerp;
    const perpNormY = perpY / distPerp;
    const qX = midX + 0.2 * dist * perpNormX;
    const qY = midY + 0.2 * dist * perpNormY;
    return `M ${startX} ${startY} Q ${qX} ${qY} ${endX} ${endY}`
}

function getTooltipHtml(d){
    if(d.hovertext !== ""){
        return (
                `<h5 class='text-lg font-semibold'>${d.id}</h5>
                <br />
                <p>${d.hovertext}</p>`
        )
    } else {
        return `<h5 class='text-lg font-semibold'>${d.id}</h5>`
    }
}

function getRadius(value){
    if(value <= 100) return 0.7;          
    if(value <= 500) return 1;
    if(value <= 5000) return 1.3;
    return 1.6;
}