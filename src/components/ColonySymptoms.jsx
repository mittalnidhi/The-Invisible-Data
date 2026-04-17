import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import colorMap from '../data/colorMap.json';

export default function ColonySymptoms(props){
    // Used to calculate bar width
    let maxCount = 0;
    for(const entry of props.peridata){
        maxCount = Math.max(maxCount, entry.value);
    }

    return (
        <div className='flex flex-col p-1'>
            {
                props.peridata.map((category, index) => {
                    const chartRowsProps = {
                        index: index,
                        text: category.name,
                        width: category.value / maxCount,
                        currentCategory: props.currentCategory,
                        setCurrentCategory: props.setCurrentCategory,
                        peridata: props.peridata
                    };
                    return <ChartRow key={index} {...chartRowsProps} />
                })
            }
        </div>
    )
}

function ChartRow(props){
    const barRef = useRef(null);

    useEffect(() => {
        d3.select(barRef.current)
            .style('background-color', function(){
                if(props.currentCategory === '') return colorMap[props.text];
                else return props.currentCategory === props.text ? colorMap[props.text] : 'white'
            })
    }, [props.currentCategory])

    function selectCategory(option){
        props.setCurrentCategory((prev) => option === prev ? '' : option)
    }

    return (
        <div onClick={() => selectCategory(props.text)} key={props.index} className='relative h-12 flex flex-row items-center gap-6'>
            <div className='chart-text flex-2 text-white text-right'>{props.text}</div>
            <div className='flex-3 h-[60%]'>
                <div ref={barRef} className={`chart-bar rounded-xs h-full text-[#00000000]`} style={{width: `${props.width * 100}%`, backgroundColor: colorMap[props.text]}}>A</div>
            </div>
        </div>
    )
}