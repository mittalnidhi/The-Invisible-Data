import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";

export default function ColonySelectorPill(props){
    const containerRef = useRef(null);

    useEffect(() => {
        const container = d3.select(containerRef.current);
        container.selectAll('.pill-option')
            .classed('pill-option-selected', function(){
                return props.currentOption === d3.select(this).text();
            });
    }, [props.currentOption]);

    function selectOption(e, option){
        props.setCurrentOption((prev) => option === prev ? '' : option)
    }

    return (
        <div ref={containerRef} className='pill-container flex flex-row rounded-3xl'>
            {props.options.map((option, index) => {
                if(index === 0){
                    return (
                        <Fragment key={index}>
                            <div onClick={(e) => selectOption(e, option)} className='pill-option mr-1'>{option}</div>
                        </Fragment>
                    )
                } else if (index === props.options.length - 1){
                    return <div key={index} onClick={(e) => selectOption(e, option)} className='pill-option'>{option}</div>
                } else {
                    return (
                        <Fragment key={index}>
                            <div onClick={(e) => selectOption(e, option)} className='pill-option mr-1'>{option}</div>
                        </Fragment>
                    )
                }
            })}          
        </div>
    )
}