import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";

export default function ColonySelectorDivided(props){
    const containerRef = useRef(null);

    useEffect(() => {
        const container = d3.select(containerRef.current);
        container.selectAll('.divided-option')
            .classed('divided-option-selected', function(){
                return props.currentOption === d3.select(this).text();
            });
    }, [props.currentOption])

    function selectOption(option){
        props.setCurrentOption((prev) => option === prev ? '' : option)
    }

    return (
        <div ref={containerRef} className='inline h-8 text-center'>
            {props.options.map((option, index) => {
                if(index === props.options.length - 1){
                    return (
                        <div key={index} onClick={() => selectOption(option)} className='inline-block divided-option mx-1 px-2 py-1'>{option}</div>
                    )
                } else {
                    return (
                        <Fragment key={index}>
                            <div onClick={() => selectOption(option)} className='inline-block divided-option mx-1 px-2 py-1'>{option}</div>
                            <span className='inline border-gray-400 border-1 h-8'></span>
                        </Fragment>
                    )
                }               
            })}
        </div>
    )
}
