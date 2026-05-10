import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';

export default function Ornament(){
    const svgRef = useRef(null);
    const margin = 1;
    const spacing = 7;

    // Adjust circles on resize
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size) => setSize(size), 200);
    useResizeObserver({ ref: svgRef, onResize });

    useEffect(() => {
            if(size.width === 0 || size.height === 0) return;
            draw();
        }, [size]);

    function draw(){
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        let i = 0;
        // Draw diagonals
        for(i; i < 4; i++){
            svg.append('line')
                .attr('x1', spacing * i + margin)
                .attr('y1', size.height - margin)
                .attr('x2', size.height - margin + spacing * i)
                .attr('y2', margin)
                .attr('fill', 'none')
                .attr('stroke', 'white')
                .attr('stroke-width', 1.5)
        }
        // Draw horizontals
        svg.append('line')
            .attr('x1', spacing * (i-1) + margin)
            .attr('y1', size.height - margin)
            .attr('x2', size.width - margin)
            .attr('y2', size.height - margin)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-width', 1.5)
    }

    return (
        <div className='flex-1 h-3 border-box '>
            <svg ref={svgRef} width='100%' height={'100%'}></svg>
        </div>
    )
}