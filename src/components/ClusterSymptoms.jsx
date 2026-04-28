import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import peridata from '../data/peridata.json';
import colorMap from '../data/colorMap.json';

export default function ClusterSymptoms(props){
    const scrollRef = useRef(null);
    const elements = {};

    const handleWheel = (e) => {
        // For whatever reason, the div won't scroll without this
        scrollRef.current.scrollTop += e.deltaY;
    };

    function handleClick(e, symptom){
        props.setCurrentSymptom((prev) => symptom !== prev ? symptom : '')
    }

    useEffect(() => {
        d3.select(scrollRef.current)
            .selectAll('.symptom-accordion')
            .classed('active', false);
        if(props.currentSymptom !== ''){
            d3.select(elements[props.currentSymptom])
                .classed('active', true);
        }
    }, [props.currentSymptom])

    return (
        <div ref={scrollRef} onWheel={handleWheel} id='accordion-container' className='w-full h-full overflow-y-auto z-70' tabIndex={0}>
            {peridata.symptoms.children.map((category, i1) => {
                return (
                    <Accordion key={i1} sx={{color: 'white', backgroundColor: '#0000'}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}>
                            <span style={{color: colorMap[category.name], marginRight: 12}}>⬤</span>{category.name}
                        </AccordionSummary>
                        {category.children.map((symptom, i2) => {
                            const element = <AccordionDetails
                                        key={i2}
                                        id={`accordion-${i1}-${i2}`}
                                        className="symptom-accordion"
                                        onClick={(e) => handleClick(e, symptom.name)}
                                        sx={{cursor: 'pointer'}}>{symptom.name}
                                    </AccordionDetails>
                            elements[symptom.name] = `#accordion-${i1}-${i2}`;
                            return element;
                        })}
                    </Accordion>
                )
            })}            
        </div>
    )
}